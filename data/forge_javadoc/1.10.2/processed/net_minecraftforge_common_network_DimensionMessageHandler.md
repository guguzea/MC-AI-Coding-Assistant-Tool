# DimensionMessageHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<ForgeMessage.DimensionRegisterMessage> → net.minecraftforge.common.network.DimensionMessageHandler

## Class signature

```java
public class DimensionMessageHandler extends io.netty.channel.SimpleChannelInboundHandler<ForgeMessage.DimensionRegisterMessage>
```

## Constructors

- `DimensionMessageHandler()`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, ForgeMessage.DimensionRegisterMessage msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`