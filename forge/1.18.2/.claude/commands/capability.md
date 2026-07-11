# Capability 系统（Forge 1.18.2）

## 注册 Capability

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class CapabilityEvents {
    @SubscribeEvent
    public static void registerCaps(RegisterCapabilitiesEvent event) {
        event.register(IExampleData.class);
    }
}
```

## 查询 Capability

```java
player.getCapability(Capabilities.ITEM_HANDLER).ifPresent(handler -> {
    // 使用 handler
});
```

## 常见错误

- ❌ `getCapability()` 返回 null → 永远返回 LazyOptional

## 参考资料

参见 `05-events.mdc`
