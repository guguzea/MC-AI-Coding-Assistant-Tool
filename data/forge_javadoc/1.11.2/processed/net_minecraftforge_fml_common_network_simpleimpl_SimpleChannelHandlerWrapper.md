# SimpleChannelHandlerWrapper

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<REQ> → net.minecraftforge.fml.common.network.simpleimpl.SimpleChannelHandlerWrapper<REQ, REPLY>

## Class signature

```java
public class SimpleChannelHandlerWrapper<REQ extends IMessage, REPLY extends IMessage> extends io.netty.channel.SimpleChannelInboundHandler<REQ>
```

## Constructors

- `SimpleChannelHandlerWrapper(java.lang.Class<? extends IMessageHandler<? super REQ, ? extends REPLY>> handler, Side side, java.lang.Class<REQ> requestType)`
- `SimpleChannelHandlerWrapper(IMessageHandler<? super REQ, ? extends REPLY> handler, Side side, java.lang.Class<REQ> requestType)`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, REQ msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`