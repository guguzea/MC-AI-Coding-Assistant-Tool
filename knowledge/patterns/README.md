# 代码模式库（Wave D 框架）

本目录收录可复用的 **小片段模式**（非完整模组）。与平台 `code-patterns/`、社区 `authored/patterns-framework` 分工见下文。

## 与 code-patterns / 反模式

| 入口 | 何时打开 |
|------|----------|
| 本目录 `examples/` | 需要最短可复制片段 |
| `forge/1.20.1/code-patterns/` 等 | 需要某系统的完整模式集 |
| `knowledge/antipatterns/` | 排错、症状对号入座 |
| `community_knowledge/authored/patterns-framework` | Agent 使用规则与维护约定 |

MCP：`read_knowledge_resource` → `mcskill://patterns/README`（本文件）。

## 单文件格式

- 首行：`平台：… · 依赖：…`  
- 代码或 JSON 块（尽量可粘贴）  
- `常见坑：` 一行链到 antipatterns 或 `authored/*`  
- 目标 **<80 行** / 文件  

## 示范索引

| 模式 | 文件 | 说明 |
|------|------|------|
| DeferredRegister 方块+物品 | `examples/deferred-block-item.md` | 1.20.1 Forge 最小注册 |
| SimpleChannel 单包 | `examples/simple-channel-packet.md` | C2S 注册与发送骨架 |
| cube_all 资源三元组 | `examples/cube-all-resources.md` | blockstate + block/item 模型 |
| ContainerData 进度 | `examples/container-data-sync.md` | Menu/GUI 数值同步 |
| ModList 兼容门闩 | `examples/modlist-compat-gate.md` | 软依赖第三方库 |

## 新增模式

1. 在 `examples/` 新建文件并更新上表。  
2. 若与第三方库相关，同步检查 `authored/library-integration*` 是否已覆盖工程化清单。  
3. 可选：镜像到 `forge/<version>/knowledge/patterns/`（该平台存在该目录时）。

第三方库接入实务：`authored/library-integration`、`authored/library-integration-jei-emi`。
