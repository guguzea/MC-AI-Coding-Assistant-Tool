# ChannelRegistrationHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket> → net.minecraftforge.fml.common.network.handshake.ChannelRegistrationHandler

## Class signature

```java
public class ChannelRegistrationHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket>
```

## Constructors

- `ChannelRegistrationHandler()`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`