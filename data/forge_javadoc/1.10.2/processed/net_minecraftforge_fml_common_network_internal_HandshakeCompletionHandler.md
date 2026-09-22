# HandshakeCompletionHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLMessage.CompleteHandshake> → net.minecraftforge.fml.common.network.internal.HandshakeCompletionHandler

## Class signature

```java
public class HandshakeCompletionHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLMessage.CompleteHandshake>
```

## Constructors

- `HandshakeCompletionHandler()`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLMessage.CompleteHandshake msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`