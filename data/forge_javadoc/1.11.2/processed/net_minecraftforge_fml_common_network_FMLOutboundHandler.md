# FMLOutboundHandler

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelOutboundHandlerAdapter → net.minecraftforge.fml.common.network.FMLOutboundHandler

## Class signature

```java
public class FMLOutboundHandler extends io.netty.channel.ChannelOutboundHandlerAdapter
```

## Constructors

- `FMLOutboundHandler()`

## Methods

- `void write(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object msg, io.netty.channel.ChannelPromise promise)`

## Fields

- `static io.netty.util.AttributeKey<FMLOutboundHandler.OutboundTarget> FML_MESSAGETARGET`
- `static io.netty.util.AttributeKey<java.lang.Object> FML_MESSAGETARGETARGS`