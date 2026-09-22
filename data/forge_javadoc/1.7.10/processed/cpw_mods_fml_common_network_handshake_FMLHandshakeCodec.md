# FMLHandshakeCodec

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.FMLIndexedMessageToMessageCodec<FMLHandshakeMessage> → cpw.mods.fml.common.network.handshake.FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec<FMLHandshakeMessage>
```

## Methods

- `void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLHandshakeMessage msg)`
- `void encodeInto(ChannelHandlerContext ctx, FMLHandshakeMessage msg, ByteBuf target)`

## Fields

- `FMLHandshakeCodec`