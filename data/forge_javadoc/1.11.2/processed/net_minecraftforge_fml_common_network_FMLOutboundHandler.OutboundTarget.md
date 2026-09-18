# FMLOutboundHandler.OutboundTarget

## Methods

- `public static FMLOutboundHandler.OutboundTarget [] values()`
- `public static FMLOutboundHandler.OutboundTarget valueOf(java.lang.String name)`
- `public abstract void validateArgs(java.lang.Object args)`
- `@Nullable public abstract java.util.List< NetworkDispatcher > selectNetworks(java.lang.Object args, io.netty.channel.ChannelHandlerContext context, FMLProxyPacket packet)`

## Description

The packet is dispatched to all players connected to the server.