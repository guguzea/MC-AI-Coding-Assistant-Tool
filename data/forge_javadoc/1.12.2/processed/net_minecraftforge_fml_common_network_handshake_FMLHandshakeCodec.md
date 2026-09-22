# FMLHandshakeCodec

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<FMLHandshakeMessage> → net.minecraftforge.fml.common.network.handshake.FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec<FMLHandshakeMessage>
```

## Methods

- `void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLHandshakeMessage msg)`
- `void encodeInto(ChannelHandlerContext ctx, FMLHandshakeMessage msg, ByteBuf target)`

## Fields

- `FMLHandshakeCodec`