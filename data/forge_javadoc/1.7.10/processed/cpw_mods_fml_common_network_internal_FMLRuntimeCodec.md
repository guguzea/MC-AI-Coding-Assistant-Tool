# FMLRuntimeCodec

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.FMLIndexedMessageToMessageCodec<FMLMessage> → cpw.mods.fml.common.network.internal.FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec<FMLMessage>
```

## Methods

- `void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLMessage msg)`
- `void encodeInto(ChannelHandlerContext ctx, FMLMessage msg, ByteBuf target)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `FMLRuntimeCodec`