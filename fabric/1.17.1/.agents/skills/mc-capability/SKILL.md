---
name: mc-capability
description: Fabric 实体事件系统。fabric-entity-events-v1。触发词：EntityEvent、fabric-entity-events
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# Capability / 实体事件（Fabric 1.17.1）

## 概述

Fabric 使用 `fabric-entity-events-v1` 模块处理实体相关的事件功能。

## 添加依赖

```groovy
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-entity-events-v1:0.2.1+1.17.1"
}
```

## 实体事件

```java
// 在 onInitialize() 中
EntityEvents.TICK.register((entity) -> {
    if (entity instanceof PlayerEntity) {
        // 每 tick 执行
    }
    return EntityEvents.TickResult.CONTINUE;
});

EntityEvents.DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        LOGGER.info("Player died: " + entity.getName());
    }
    return EntityEvents.DeathResult.ALLOW;
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
