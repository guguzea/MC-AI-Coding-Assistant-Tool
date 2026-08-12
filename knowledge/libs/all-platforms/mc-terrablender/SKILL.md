---
name: mc-terrablender
description: TerraBlender 群系 region API。往现有世界生成里加自定义生物群系、配置 Surface Rule、与 BOP/BYG 共存。触发词：TerraBlender、terrablender、region、生物群系、biome、SurfaceRule、群系模组
platforms: [fabric, forge, neoforge]
mcVersions: ["1.18.1-26.2"]
communityDocId: authored/lib-terrablender
mappings: "库按各 loader 预重映射，无需特殊配置；Fabric ≤1.21.x 为 yarn、26.x 为 mojmap"
---

# TerraBlender 群系集成（操作指引）

给 AI 的操作指引：把自定义生物群系兼容式混入现有世界生成（1.18+ 地形系统标准方案）。详细信息用 `search_community_docs` 查 `authored/lib-terrablender`，API 细节以[官方仓库](https://github.com/Glitchfiend/TerraBlender)当前 README 与 wiki 为准。

## 何时用 / 何时不用

- 用：往主世界/下界/末地加新群系、自定义地表、要与其它群系模组共存
- 不用：只改单个群系内的结构/装饰（原版数据包即可）；完全自建维度（原版维度方案更直接）；MC < 1.18.1

## Decision Flow

```
Decision: 要不要用 TerraBlender
→ MC < 1.18.1 → 不用（窗口外）
→ 自建独立维度/完全掌控地形 → 原版维度方案
→ 在现有世界加群系、与其它群系模组共存 → TerraBlender
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应构建（Quilt 另有构建，按短文 loaders）
   ├─ region：把群系声明进 region（主/下界/末地），权重可调
   ├─ 地表：配 Surface Rule，禁止手写 BiomeProvider
   └─ 版本：1.18.1-26.2 内与 MC 对齐（Modrinth 文件页为准）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 抄 maven 仓库与坐标（Fabric 用 `modImplementation`，Forge/Neo 用对应配置）；`fabric.mod.json` / `mods.toml` 的 `depends` 写 `terrablender`；软依赖门闩做法见 `authored/soft-deps-modlist`
2. 注册 region：启动阶段把你的群系声明进一个 region（主世界/下界/末地对应），指定权重；region 是「在哪生成」的容器，群系是「生成什么」，两者分开管理
3. 绑定群系：自定义群系挂到 region 的群系提供器，附生成条件与权重
4. 配地表：注册 Surface Rule（顶层/下层方块、噪声），加到该 region 的规则列表；规则顺序敏感，错了会被别的模组覆盖
5. 数据包侧：群系 JSON 与生物群系标签照常放 `data/<modid>/worldgen/...`；资源/数据包路径写错会导致客户端或服务端拿不到群系数据
6. 兼容验证：与 BOP/BYG/Regions Unexplored 同装时，确认各方 TerraBlender 版本兼容，region 之间靠权重协商，冲突以日志为准

## 软 / 硬依赖

- 硬依赖：运行时必须有 TerraBlender；只 `compileOnly` 却当硬依赖用 → 未装时 `NoClassDefFoundError`
- 与其它群系模组是「共存」关系，不是依赖关系；先小权重（如 1）验证，别一上来 99 把原版群系挤没

## 常见错误

- 不声明 region 直接改 BiomeProvider → 与其它模组冲突 / 世界生成异常
- Surface Rule 顺序或优先级不对 → 地表被覆盖或地形异常
- 群系 ID / 数据包路径与 modId 不一致 → 群系不生成或加载失败
- 权重配得极端 → 原版群系几乎不出现
- 版本不核对就抄旧坐标 → 1.26 之前与 26.x 的地形 API 差异大

## 自检清单

- 依赖版本与文件页一致；未装 TerraBlender（软依赖场景）进档不崩
- 新群系实际生成，地表方块层符合预期；原版群系仍在
- 服务端与客户端加载无 worldgen 异常；`runServer` 无相关报错

## 参考

- 官方：https://github.com/Glitchfiend/TerraBlender
- 社区：`search_community_docs` → `authored/lib-terrablender`
- 相关 Skill：`mc-worldgen`、`mc-datapack`
- 不确定时：打开官方 README + wiki（含示例群系与 region 配置），未核对前不写死任何类名/方法签名
