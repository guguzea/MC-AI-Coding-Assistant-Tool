[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.3，仅作结构/流程提示，不是 1.21.10 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.10) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-fluid
description: Fabric 流体开发。Fluid、FluidType、FlowableFluid。触发词：流体、Fluid、FluidType
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# 流体开发（Fabric 1.21.3）

## 快速开始

```java
// 1. 创建流体
private static final Fluid MY_FLUID = Registry.register(
    Registries.FLUID,
    Identifier.of(MOD_ID, "my_fluid"),
    new FabricFlowableFluid.Settings()
        .slopeFindDistance(3)
        .levelDecreasePerBlock(1)
        .tickRate(5)
        .supportsBoating(true)
);

// 2. 注册方块状态映射
Registry.register(
    Registries.FLUID,
    Identifier.of(MOD_ID, "my_fluid"),
    MY_FLUID
);
```

## Decision: 选择流体类型

```
IF 可流动的液体
  → FabricFlowableFluid

IF 静态流体（岩浆等）
  → StillFluid
```

## 常见错误

- ❌忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册 |
| `mc-block` | 流体需要对应的方块 |
