# FluidIdRegistryMessageHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<ForgeMessage.FluidIdMapMessage> → net.minecraftforge.common.network.FluidIdRegistryMessageHandler

## Class signature

```java
public class FluidIdRegistryMessageHandler extends io.netty.channel.SimpleChannelInboundHandler<ForgeMessage.FluidIdMapMessage>
```

## Constructors

- `FluidIdRegistryMessageHandler()`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, ForgeMessage.FluidIdMapMessage msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`