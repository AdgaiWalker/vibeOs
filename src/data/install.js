const repositoryUrl = "https://github.com/AdgaiWalker/vibeoOs";

export const skillRepository = Object.freeze({
  name: "vibeoOs",
  url: repositoryUrl,
  ref: "main",
  sourceUrl: `${repositoryUrl}/tree/main`,
  skills: Object.freeze([
    Object.freeze({ name: "vibe-check", path: "skills/vibe-check" }),
    Object.freeze({ name: "vibe-flow", path: "skills/vibe-flow" }),
    Object.freeze({ name: "vibe-recipe", path: "skills/vibe-recipe" }),
  ]),
});

const skillList = skillRepository.skills
  .map(({ name, path }) => `- ${name}：${path}`)
  .join("\n");

export const agencyInstallPrompt = `请帮助我评估并安装来自以下来源的 Skill：

仓库：${skillRepository.url}
当前分支：${skillRepository.ref}
可安装 Skill：
${skillList}

先不要修改文件、执行仓库脚本或安装依赖。

请先：
1. 确认当前 Agent 是否支持这个仓库的 Skill 格式，以及支持“全局安装”和“当前项目安装”中的哪些范围；
2. 用“想明白、串起来、变套路”说明三个 Skill 的用途，让我选择安装一个还是全部；
3. 检查现有安装，说明是未安装、已安装、可更新、损坏，还是存在同名不同来源冲突；同时检查旧名 vibe-craft 和 skill-craft，但不要直接删除；
4. 用非技术语言解释“当前项目”和“全局”的影响，并列出将写入的准确路径；
5. 然后一次性询问我：安装哪些 Skill，以及选择哪个安装范围，并等待我的回答。

得到确认后，使用当前 Agent 最安全的原生安装方式。不要覆盖或删除不属于本来源的现有安装。旧名只有在确认来自本仓库、且我明确同意迁移后才能移除。若需要运行脚本、安装依赖或替换冲突版本，先单独说明风险并再次征得同意。

私有仓库只能使用已有认证，不要要求我在聊天中粘贴 Token。安装结束后，请报告来源 URL、实际 commit、安装路径、验证结果、何时生效，以及更新、卸载和回滚方法。若当前 Agent 或环境不支持，请停止并说明原因，不要宣称安装成功。`;
