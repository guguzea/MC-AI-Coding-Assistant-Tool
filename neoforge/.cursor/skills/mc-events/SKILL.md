---
name: mc-events
description: Minecraft NeoForge 事件系统。@SubscribeEvent、事件总线、物理端检测。触发词：事件、@SubscribeEvent、Bus.FORGE、Bus.MOD、DistExecutor、AttachCapabilitiesEvent
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# 事件系统（NeoForge 1.20.4）

## 快速总览

NeoForge 使用与 Forge 相同的事件系统，但包名从 `net.minecraftforge` 变为 `net.neoforged`。

## 事件订阅基础

```java
// FORGE 总线：用于 NeoForge 原生事件
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.FORGE)
public class ModEvents {
    @SubscribeEvent
    public static void onPlayerInteract(PlayerInteractEvent.RightClickBlock event) {
        // 玩家右键方块
    }
}

// MOD 总线：用于自定义事件
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class ModSetup {
    @SubscribeEvent
    public static void onCommonSetup(FMLCommonSetupEvent event) {
        // 通用初始化
    }
}
```

## 物理端检测

```java
// DistExecutor（推荐）
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> clientMethod());
DistExecutor.unsafeRunWhenOn(Dist.DEDICATED_SERVER, () -> () -> serverMethod());

// FMLEnvironment（仅初始化用）
if (FMLEnvironment.dist == Dist.CLIENT) {
    // 客户端初始化
}
```

## Decision: 选择事件总线

```
IF 事件来自 NeoForge/Minecraft（LivingDeath、BlockBreak、PlayerInteract 等）
  → Bus.FORGE

IF 事件来自 mod 自定义
  → Bus.MOD

IF 不确定
  → 优先尝试 Bus.FORGE
```

## 常见错误

- ❌ 在错误总线监听事件（事件永远不触发）
- ❌ 在 TickEvent 中执行重操作（服务端卡顿）
- ❌ 在渲染线程修改服务端数据（崩溃）

## 参考资料

- 详细示例：参见 `05-events.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 事件中引用已注册对象 |
| `mc-capability` | AttachCapabilitiesEvent 用于附加 Capability |
| `mc-gui` | 事件中打开 GUI |
