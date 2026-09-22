# EntitySpawnHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelInboundHandlerAdapter → io.netty.channel.SimpleChannelInboundHandler<FMLMessage.EntityMessage> → net.minecraftforge.fml.common.network.internal.EntitySpawnHandler

## Class signature

```java
public class EntitySpawnHandler extends io.netty.channel.SimpleChannelInboundHandler<FMLMessage.EntityMessage>
```

## Constructors

- `EntitySpawnHandler()`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLMessage.EntityMessage msg)`
- `void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause)`