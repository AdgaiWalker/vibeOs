import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Agency-Craft homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>Agency-Craft · 把模糊变成具体<\/title>/i);
  assert.match(html, /让人说清楚/);
  assert.match(html, /让 AI 做得到/);
  assert.match(
    html,
    /不是只有伟大的开创者，才能让人们看见新的可能。/,
  );
  assert.match(html, /AGENCY CONTRACT/);
  assert.match(html, /Vibe-Craft/);
  assert.match(html, /Vibe-Flow/);
  assert.match(html, /Skill-Craft/);
  assert.match(html, /AC-001/);
  assert.match(html, /git clone/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
  assert.doesNotMatch(html, /react-loading-skeleton/);
});

test("removes starter resources and preserves project-specific metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(layout, /Agency-Craft · 把模糊变成具体/);
  assert.match(layout, /\/og\.png/);
  assert.match(page, /<header className="site-header">/);
  assert.match(page, /<nav className="site-nav"/);
  assert.match(page, /<footer className="site-footer">/);
  assert.match(page, /aria-labelledby=/);
  assert.doesNotMatch(page, /dangerouslySetInnerHTML/);
  assert.ok(
    page.indexOf("不是只有伟大的开创者") < page.indexOf("VIBE 2.0"),
    "the new thesis must remain the first hero sentence",
  );

  const hosting = JSON.parse(
    await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(hosting, { d1: null, r2: null });

  const publicFiles = new URL("public/", templateRoot);
  await access(publicFiles);
});
