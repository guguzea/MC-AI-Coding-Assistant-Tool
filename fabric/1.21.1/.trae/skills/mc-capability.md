---
version: "1.21.1"
platform: fabric
description: |
  Fabric 1.21.1 Capability 系统与实体事件速查卡。

## Capability 系统

### 核心 API

Fabric 使用 `fabric-item-api-v1` 提供 Capability 类似功能：

```groovy
modApi "net.fabricmc.fabric-api:fabric-item-api-v1:9.1.1+1.21"
```

### 注册 Capability

```java
public class MyCapability {
    public static final Capability<IItemHandler> ITEM_HANDLER = CapabilityRegistry.ITEM;
}
```

### 请求 Capability

```java
player.getCapability(Registries.ITEM.getCapability(...)).orElse(null);
```

## 实体事件

### EntityEvents

```java
// 实体受伤
EntityEvents.ENTITY_HURT.register((entity, source, amount, flag) -> {
    if (entity instanceof PlayerEntity && amount > 5.0f) {
        // 玩家受伤超过 5 点时触发
    }
    return amount;  // 返回修改后的伤害值
});

// 实体死亡
EntityEvents.ENTITY_DEATH.register((entity, source) -> {
    if (entity instanceof Monster) {
        // 怪物死亡时触发
    }
});
```

### ServerLifecycleEvents

```java
ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    // 服务端启动完成
});

ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
    // 服务端即将关闭
});
```

### PlayerTickEvents

```java
PlayerTickEvents.END.register(player -> {
    // 玩家每 tick 结束时执行（服务端）
});

@Environment(EnvType.CLIENT)
PlayerTickEvents.END.register(player -> {
    // 玩家每 tick 结束时执行（客户端）
});
```

## 常见错误

- ❌在共享代码中创建客户端专用对象 — 使用 `world.isClient` 区分
- ❌忘记在 `onInitialize()` 中注册事件 — 事件不会被触发
- ❌在非主线程处理事件 — Fabric 事件在主线程执行，无需额外同步
