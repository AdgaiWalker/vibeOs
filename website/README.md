# Agency-Craft 官网

Agency-Craft 的中文优先官方网站。它用一条可视化的协作闭环解释 Vibe 2.0：AI 引导意图，人做决定；AI 执行，人用证据验收。

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 质量检查

```bash
npm run lint
npm run build
npm test
```

`npm test` 会验证服务端渲染、项目文案、语义结构、社交预览元数据，并阻止脚手架内容回归。

## 目录

- `app/`：页面、元数据与视觉样式；
- `public/og.png`：1200 × 630 社交预览图；
- `tests/`：服务端渲染与项目身份检查；
- `.openai/hosting.json`：Sites 运行时声明，当前不绑定 D1 或 R2。

正文保持匿名、无数据库、无客户端状态依赖。生产部署与自定义域名不在当前交付范围内。
