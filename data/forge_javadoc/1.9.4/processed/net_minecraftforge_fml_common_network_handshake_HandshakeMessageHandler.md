# HandshakeMessageHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLHandshakeMessage> → net.minecraftforge.fml.common.network.handshake.HandshakeMessageHandler<S>

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S>& IHandshakeState<S>> extends io.netty.channel.SimpleChannelInboundHandler<FMLHandshakeMessage>
```

## Constructors

- `HandshakeMessageHandler(java.lang.Class<S> stateType)`

## Methods

- `void channelActive(io.netty.channel.ChannelHandlerContext ctx)`
- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt)`