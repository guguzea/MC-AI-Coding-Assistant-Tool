# NetworkEventFiringHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket> → net.minecraftforge.fml.common.network.NetworkEventFiringHandler

## Class signature

```java
public class NetworkEventFiringHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLProxyPacket>
```

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt)`