export const WORKFLOW_TEMPLATES: Record<string, { title: string; body: string }> = {
  "mc-new-block": {
    title: "新方块工作流",
    body: `1. DeferredRegister 注册方块（mc-registry / 01-registry）
2. 注册 BlockItem（同名）
3. blockstates + 模型（generate_model 或 DataGen）
4. lang en_us/zh_cn（generate_lang）
5. loot table（generate_datagen loottable）
6. 可选：tags、recipe DataGen`,
  },
  "mc-new-entity": {
    title: "新实体工作流",
    body: `1. EntityType DeferredRegister + 属性（mc-entity）
2. 注册 SpawnPlacement / 生物蛋
3. 客户端 EntityRenderer（generate_entity_renderer）
4. loot / 音效按需`,
  },
  "mc-new-gui": {
    title: "GUI 工作流",
    body: `1. MenuType + AbstractContainerMenu（mc-gui）
2. Screen + MenuScreens.register
3. SimpleChannel 同步槽位（mc-networking）`,
  },
  "mc-crash-triage": {
    title: "崩溃分诊",
    body: `1. analyze_log / crash_analyze
2. search_community_docs 按 crashKind
3. validate_project + mixin_analyze
4. diagnose_gradle 若启动阶段失败`,
  },
  "mc-port-mod": {
    title: "移植模组",
    body: `1. analyze_porting_path
2. 与用户确认 targetPlatform / targetVersion
3. port_project dryRun=true 逐步执行
4. get_migration_guide 查路线摘要`,
  },
};

export function getWorkflowTemplate(name: string): { found: boolean; name: string; title?: string; body?: string } {
  const t = WORKFLOW_TEMPLATES[name];
  if (!t) {
    return { found: false, name, body: `可用模板: ${Object.keys(WORKFLOW_TEMPLATES).join(", ")}` };
  }
  return { found: true, name, title: t.title, body: t.body };
}

export function listWorkflowTemplateNames(): string[] {
  return Object.keys(WORKFLOW_TEMPLATES);
}
