# Prompts / Resources 客户端兼容 Spike（B0-b）

## 结论

| 客户端 | tools | prompts/list|get | resources/list|read |
|--------|-------|------------------|---------------------|
| Cursor（本仓库主目标） | 支持 | 有限 / UI 常不暴露 | 有限 |
| Claude Desktop | 支持 | 通常支持 | 通常支持 |
| 其他 IDE | 不明 | 不明 | 不明 |

## 选定策略（已实现）

1. **始终** `registerPrompt` + `registerResource`（协议正确，Claude 等可用）。
2. **工具兜底**（Cursor 主路径）：
   - `get_workflow_template` — 与 Prompt 同名正文
   - `list_knowledge_resources` / `read_knowledge_resource` — 与 Resource 同款内容

验收：仅调用 tools 即可拿到工作流模板与知识 URI 正文。
