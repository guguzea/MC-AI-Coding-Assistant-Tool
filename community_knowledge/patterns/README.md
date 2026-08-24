# 代码模式库（community_knowledge/patterns）

本目录是 **Wave D 完成定义** 中的 patterns 框架：可复用的小片段模式（非完整模组）。

与 `knowledge/patterns/` 的分工（2026-08 审计澄清）：**模式正文与验收以 `knowledge/patterns/` 为准**；本目录管 community 索引收录与 Wave D 框架约定。两套 `examples/` 文件名并行、互为独立文（如本目录 `mod-ci-github-actions.md` ≠ knowledge 侧 `ci-github-actions.md`），不互为镜像、禁止双向覆盖。

## 文件约定

- `README.md`：本索引
- `examples/<name>.md`：单模式，建议 **<80 行**
- 每篇含：适用平台/版本、前置 Skill / MCP 工具、最小片段、常见坑

## 示范索引（6）

| 模式 | 文件 |
|------|------|
| DeferredRegister 方块+物品 | `examples/deferred-register.md` |
| SimpleChannel 单包 | `examples/simple-channel.md` |
| Data Component（1.20.5+/1.21） | `examples/data-component.md` |
| cube_all 资源三元组 | `examples/cube-all-resources.md` |
| ForgeConfigSpec 最小配置 | `examples/config-spec.md` |
| 模组 CI（GitHub Actions 模板） | `examples/mod-ci-github-actions.md` |

## 不清楚时

打开官方文档（`search_docs` / `get_doc_full`），禁止臆造 API。
