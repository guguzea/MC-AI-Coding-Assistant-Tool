# GeckoLib 集成要点

## 何时用

实体/方块需要复杂动画、Geo 模型时。官方文档优先于任何二手教程。

## Decision Flow

1. 确认 MC / Forge 或 Fabric 版本与 GeckoLib 版本矩阵匹配（Modrinth / CurseForge 文件页）。
2. `build.gradle` 加入官方推荐依赖坐标；**不要**抄过期 Gist。
3. 实体实现 GeckoLib 接口 / 使用推荐基类；渲染器放在**客户端**。
4. 资源：`geo/`、`animations/`、纹理路径与注册名一致。

## MCP

- `check_dependencies` / `diagnose_gradle`
- `search_community_docs`（实务）→ 仍须打开 [GeckoLib 文档](https://github.com/bernie-g/geckolib)
- Skill：`mc-geckolib`、`mc-entity`、`mc-renderer`

## 常见坑

- 服务端引用客户端渲染类 → 专用服务器崩溃
- 版本错配导致 `NoClassDefFoundError`
- 动画文件未进 jar（资源路径错误）

## 不清楚时

打开 GeckoLib 当前版本 README / wiki + 本仓库 `search_docs`，禁止臆造注解名。
