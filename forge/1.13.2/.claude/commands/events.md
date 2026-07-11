---
name: events
description: Minecraft Forge 事件系统（Forge 1.13.2）。@SubscribeEvent、RegistryEvent、Dist 检查。触发词：@SubscribeEvent、RegistryEvent、DistExecutor、FMLCommonSetupEvent
---

# 事件系统（Forge 1.13.2）

## @SubscribeEvent 基础规范

```java
@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(...);
}
```

## Dist 检查

```java
// 使用 DistExecutor
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> clientMethod());
DistExecutor.unsafeRunWhenOn(Dist.DEDICATED_SERVER, () -> () -> serverMethod());
```

## 常用事件

| 事件 | 用途 |
|------|------|
| `RegistryEvent.Register<T>` | 注册内容 |
| `LivingDeathEvent` | 实体死亡 |
| `PlayerInteractEvent` | 玩家交互 |
| `FMLCommonSetupEvent` | 通用初始化 |
| `FMLClientSetupEvent` | 客户端初始化 |

## 参考资料

- 详细示例：参见 `05-events.mdc`
