---
name: mc-events
description: Minecraft Forge 事件系统。@SubscribeEvent、事件总线、Forge 事件监听。触发词：事件、Event、@SubscribeEvent、Bus.FORGE、Bus.MOD
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 事件系统（Forge 1.15.2）

## 快速开始

```java
// 事件订阅类
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.FORGE)
public class ModEvents {

    @SubscribeEvent
    public static void onPlayerInteract(PlayerInteractEvent.RightClickBlock event) {
        // 玩家右键方块
        if (event.getWorld().isRemote) return; // 确保服务端
        // ...
    }

    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // 生物死亡
        if (event.getEntity().world.isRemote) return;
        // ...
    }
}
```

## Decision: 选择事件总线

```
IF Forge 原生事件（Registry、LivingDrops、PlayerInteract 等）
  → Bus.FORGE

IF Mod 自定义事件
  → Bus.MOD
```

## Decision: 选择正确的事件类

```
IF 监听玩家右键点击方块
  → PlayerInteractEvent.RightClickBlock

IF 监听生物死亡
  → LivingDeathEvent

IF 监听实体掉落物品
  → LivingDropsEvent

IF 监听玩家登录/登出
  → PlayerEvent.PlayerLoggedInEvent / PlayerLoggedOutEvent

IF 监听 Tick
  → TickEvent.ServerTickEvent / WorldTickEvent

IF 监听 Registry 注册
  → RegistryEvent.Register<T>

IF 监听服务端启动
  → FMLCommonSetupEvent

IF 监听客户端启动
  → FMLClientSetupEvent
```

## 物理端判断

```java
// 世界逻辑端判断
if (world.isRemote) {
    // 客户端逻辑
} else {
    // 服务端逻辑
}

// 物理端判断
if (FMLEnvironment.dist == Dist.CLIENT) {
    // 仅客户端
}
```

## 常见错误

- ❌ 在错误的事件总线上监听
- ❌ 在 TickEvent 中做重操作
- ❌ 在渲染线程修改世界数据

## 参考资料

- 详细示例：参见 `05-events.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | RegistryEvent 用于旧版注册方式 |
| `mc-entity` | 实体相关事件监听 |
| `mc-block` | 方块交互事件 |
