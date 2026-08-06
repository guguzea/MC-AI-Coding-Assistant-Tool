---
name: mc-capability
description: Fabric Attachment API（替代旧 Capability）。Key.create、getData、setData。触发词：Attachment、Capability、实体数据
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# Attachment API（Fabric 1.21.11）

## ⚠️ 重要：Capability API 已被移除

**从 1.21 开始，Fabric 和 Minecraft 均已移除旧版 Capability API，统一使用 Attachment API。**

## Attachment API 概述

Attachment API 用于为实体、物品等附加自定义数据。

## 注册 Attachment

```java
public class MyAttachments {
    // 简单数据 Attachment
    public static final Key<MyData> MY_DATA = Key.create(
        Registries.ATTACHMENT_TYPE,
        new Identifier(MOD_ID, "my_data")
    );

    // 也可以直接存储简单类型
    public static final Key<Integer> KILL_COUNT = Key.create(
        Registries.ATTACHMENT_TYPE,
        new Identifier(MOD_ID, "kill_count")
    );
}
```

## 使用 Attachment

```java
// 在任意实体上获取/设置
MyData data = entity.getData(MyAttachments.MY_DATA);
entity.setData(MyAttachments.MY_DATA, newData);

// 简单类型
int kills = entity.getData(MyAttachments.KILL_COUNT);
entity.setData(MyAttachments.KILL_COUNT, kills + 1);
```

## 与旧 Capability 的对比

| 旧 API（已移除） | 新 API（1.21.x） |
|----------------|-----------------|
| `Capability<T>` + `CapabilityProvider` | `Key<T>` + `Key.create()` |
| `ICapabilityProvider.getCapability()` | `entity.getData(KEY)` |
| `attachCapabilities()` | `Key` 注册后直接使用 |
| `Direction`（方向）参数 | 无方向参数 |

## 实体事件

Fabric 仍提供实体事件系统（fabric-entity-events）：

```java
// 在 onInitialize() 中
EntityEvents.TICK.register((entity) -> {
    if (entity instanceof PlayerEntity player) {
        // 每 tick 执行
    }
    return EntityEvents.TickResult.CONTINUE;
});

EntityEvents.DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        LOGGER.info("Player died");
    }
    return EntityEvents.DeathResult.ALLOW;
});
```

## 常见错误

- ❌ 使用旧的 `Capability<T>` 接口 — 1.21.x 已移除，改用 `Key.create()`
- ❌ 使用 `CapabilityProvider` 和 `getCapability()` — 改用 `entity.getData(KEY)`
- ❌ 忘记注册 `Key` — Attachment 需要通过 `Key.create()` 创建

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-entity` | Attachment 常用于实体数据存储 |
| `mc-registry` | Key 需要在 mod 初始化时可用 |
