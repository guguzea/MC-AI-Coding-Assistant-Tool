# 网络通信（Forge 1.18.2）

## 创建 SimpleChannel

```java
public static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,
    PROTOCOL_VERSION::equals
);
```

## 消息处理器

```java
public static void handle(MyMessage msg, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        // 服务端处理
    });
    ctx.get().setPacketHandled(true);
}
```

## 常见错误

- ❌ 在网络线程直接修改世界（未用 enqueueWork）
- ❌ 逐字段发送大量数据

## 参考资料

参见 `06-networking.mdc`
