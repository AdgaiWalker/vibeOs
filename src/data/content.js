export const chapters = [
  { id: "hero", label: "开场" },
  { id: "why", label: "方向" },
  { id: "loop", label: "闭环" },
  { id: "gates", label: "闸门" },
  { id: "contract", label: "契约" },
  { id: "evidence", label: "证据" },
];

export const loopSteps = [
  "观察现状",
  "建立对照",
  "人做决定",
  "写成规格",
  "裁决能力",
  "AI 执行",
  "按证据验收",
  "沉淀经验",
];

export const gates = [
  {
    key: "CHECK",
    skill: "Vibe-Check",
    description: "想明白：把模糊感觉理成明确目标",
    promptLabel: "把还说不清的想法交给它",
    prompt:
      "$vibe-check 帮我把这个想法理明白；每次只问一个真正影响结果的问题。",
    copyLabel: "复制这句话",
  },
  {
    key: "FLOW",
    skill: "Vibe-Flow",
    description: "串起来：自动挑工具并把事情做完",
    promptLabel: "目标想清楚后交给它",
    prompt:
      "$vibe-flow 我想完成 xxx。请自己选择合适的工具、安排顺序并推进到可以检查的结果。",
    copyLabel: "复制这句话",
  },
  {
    key: "RECIPE",
    skill: "Vibe-Recipe",
    description: "变套路：把一次成功炼成通用菜谱",
    promptLabel: "这次做成后交给它",
    prompt:
      "$vibe-recipe 把这次做成的方法提炼成换个参数就能复用的 AI 菜谱，并用真实任务验证。",
    copyLabel: "复制这句话",
  },
];

export const contractFields = [
  "contract_version",
  "objective",
  "state",
  "decisions",
  "boundaries",
  "acceptance_criteria",
  "handoff",
  "evidence",
];

export const contractFieldCopy = {
  contract_version: "0.1 · handoff envelope",
  objective: "终局结果与执行状态",
  state: "current → target",
  decisions: "锁定、暂定与开放判断",
  boundaries: "必须保留、明确避开与本轮不处理",
  acceptance_criteria: "可验证的通过条件",
  handoff: "下一所有者、输入、继续闸门与重开条件",
  evidence: "支持每个判断的证据",
};
