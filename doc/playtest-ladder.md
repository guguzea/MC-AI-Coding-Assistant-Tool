# 游玩测试阶梯（L0–L7 逐层判据）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「游玩测试要求（交付门槛，每轮强制）」的**阶梯表原文落点**。
> 根纲保留「必须测到与改动面相称的层级」这条铁律与指针；这里存逐层判据、红的长相与最低测层结论。

### 阶梯：逐层向上，低层红不许跳高层

| 层 | 测什么 | 用什么测 | 红会长什么样 |
| --- | --- | --- | --- |
| **L0 构建** | 编译产出 jar | `gradlew build`；构建配置问题走 `diagnose_gradle` | 编译错 / `BUILD FAILED` |
| **L1 结构与静态** | 工程骨架、平台元数据、依赖、Mixin、AT/AW、资源引用 | `validate_project`、`check_dependencies`、`mixin_analyze`、`validate_at` / `validate_aw`、`audit_resources` | `mods.toml` 的 id 与代码不符、引用不存在的类、模型指向缺失纹理 |
| **L2 数据面** | 配方 / 战利品 / 标签 / 进度 / 方块状态 / lang 键 | `validate_datapack_json`；基岩 `validate_bp_json` / `validate_addon_manifest` | JSON 被拒、普通合成缺 `result`、lang 缺键 |
| **L3 自动化功能** | 注册、逻辑、副作用（不必真人玩） | GameTest（工作流 `mc-gametest`） | 断言失败，或测试根本没注册 |
| **L4 真机冒烟** | 进得去世界，能移动 / 破坏 / 开 GUI / 翻背包 | `generate_playtest_driver scenario=smoke`（已验证档出真 driver）；桥路线 `playtest_bridge` | `exit-code.txt` = `1`；截图停在菜单 |
| **L5 场景验收** | **本次改动**那个玩家可见行为 | 自定义 `plan` DSL 或意图会话；后置条件 `block_state` / `entity_count` / `inventory_contains` / `marker_log` / `screen_present` | 断言不成立 / 超预算判红 |
| **L6 服务端与多人(日常可选,由用户判断做不做)** | 专用服起得来、客户端连得上、状态同步 | 工作流 `mc-server-multiplayer-test`；`runServer` | 服务端启动崩溃、两侧状态不一致、权限报错 |
| **L7 回归与共存(日常可选,由用户判断做不做)** | 改动前的功能不劣化；与其他 mod 同装 | 同一次会话连做多轮（改 `plan.txt` 热载，不重启）；工作流 `mc-modpack` | 旧断言转红、注册名 / 事件冲突 |
| **收口** | 发布前清单 | `check_publish_ready`；工作流 `mc-publish` | license / version 缺项，`build/libs` 不像正式 jar |

**最低测到哪层，按改动面取最大者**：改逻辑 → 至少 L3。改玩家可见行为（方块 / 物品 / 实体 / GUI / 配方效果 / 世界生成）→ 至少 L4 + L5。改网络、存档或服务端侧 → 必须 L6。升 loader 或 MC 版本 → L0–L7 全跑。纯注释 / 文档改动 → 到 L0 即可。
