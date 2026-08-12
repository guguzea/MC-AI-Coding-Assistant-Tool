---
name: mc-trinkets
description: Fabric/Quilt 饰品槽（Trinkets）集成。触发词：Trinkets、饰品槽、accessory、slot、curios（Fabric 语境）
platforms: [fabric, quilt]
mcVersions: ["1.17-1.21.1"]
communityDocId: authored/lib-trinkets
mappings: hint
---

# Trinkets 饰品槽（Fabric/Quilt）

Fabric 系饰品槽事实标准：6 组默认槽位（头/胸/腿/脚/手/副手类），槽位数据驱动，支持扩展槽组。**已停更于 1.21.1（2024-07 后无新构建），1.21.4+ / 26.x 不要选它。**

## Decision Flow

```
Decision: 饰品槽方案选择
→ platform = forge / neoforge → 本 skill 不适用：读 mc-curios（Curios），禁止把 Trinkets 代码拷到 Forge
→ platform = fabric / quilt：
   ├─ mcVersion 1.17-1.21.1 且有对应构建 → 可用 Trinkets（存量项目）
   ├─ mcVersion 1.21.4+ / 26.x → 停更窗口，不要用：自研槽位（组件/NBT）或原版机制
   └─ 已选 Trinkets：
        ├─ 槽位：数据驱动定义（槽组 JSON，6 组默认），以官方格式为准
        ├─ 物品：注册为饰品（接口/注册 API 以官方 README 为准），声明可放入的槽组
        └─ 依赖：硬依赖 depends，或软依赖门闩 isModLoaded("trinkets")
```

## 软/硬依赖

- 硬依赖：`fabric.mod.json` `depends` 写 `trinkets`；maven 仓库与坐标照官方 README，Loom `modImplementation`
- 软依赖：门闩写法见 `authored/soft-deps-modlist`；只 compileOnly 却硬访问会 NoClassDefFoundError
- 与 CCA（Cardinal Components）搭配：Trinkets 依赖 CCA，版本搭配以官方为准
- 类加载隔离：饰品效果在服务端计算，客户端只做渲染与 Tooltip

## 官方文档

- 仓库：https://github.com/emilyploszaj/trinkets （README 与 wiki 是当前格式唯一依据）

## communityDocId 引用

- `authored/lib-trinkets`：完整要点（何时用/不用、集成流程、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 给 1.21.4+ / 26.x 项目声明 trinkets 依赖：无构建，启动崩溃（停更窗口最常见坑）
- 把 Trinkets 代码拷到 Forge 工程：编译即炸；Forge 系用 Curios（mc-curios）
- 只 compileOnly 却硬依赖：未装 Trinkets 时 NoClassDefFoundError
- 自定义槽组 ID 与其它模组冲突：槽位错乱，命名前查 tag/槽位约定
- 饰品效果写在客户端：专用服不生效

## 自检

- 版本 ≤ 1.21.1 且依赖版本与文件页一致
- 软依赖时未装 Trinkets 能进档；装了能放入/取出/重启不丢
- 服务端属性生效，槽位无重复 ID 警告

未核对签名不写死：类名/包名/方法以官方 README 为准，引用前先打开官方文档。
