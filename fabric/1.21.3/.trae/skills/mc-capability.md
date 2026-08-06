---
name: mc-capability
description: Fabric Capability 系统。fabric-item-group-api-v1 用于物品分组，fabric-entity-events-v2 用于实体事件。触发词：Capability、FabricCapability
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# Capability / 实体事件（Fabric 1.20.1）

## 概述

Fabric 使用 `fabric-entity-events-v2` 模块处理实体相关的 Capability 功能。

## 添加依赖

```groovy
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-entity-events-v2:2.2.3+1.21"
}
```

## 实体事件

```java
// 在 onInitialize() 中
EntityEvent.TICK.register((entity) -> {
    if (entity instanceof PlayerEntity) {
        // 每 tick 执行
    }
    return EntityEvent.TickResult.CONTINUE;
});

EntityEvent.DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        LOGGER.info("Player died: " + entity.getName());
    }
    return EntityEvent.DeathResult.ALLOW;
});
```

## 常见错误

- ❌在非主线程处理实体事件
- ❌忘记 `return` 结果

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-entity` | 实体事件用于实体行为修改 |
| `mc-registry` | 注册实体类型 |
