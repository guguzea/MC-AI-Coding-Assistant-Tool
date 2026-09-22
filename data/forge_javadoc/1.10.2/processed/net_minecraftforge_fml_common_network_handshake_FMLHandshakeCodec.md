# FMLHandshakeCodec

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.ChannelDuplexHandler → io.netty.handler.codec.MessageToMessageCodec<FMLProxyPacket, A> → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<FMLHandshakeMessage> → net.minecraftforge.fml.common.network.handshake.FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec<FMLHandshakeMessage>
```

## Methods

- `void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLHandshakeMessage msg)`
- `void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg, io.netty.buffer.ByteBuf target)`

## Fields

- `FMLHandshakeCodec`