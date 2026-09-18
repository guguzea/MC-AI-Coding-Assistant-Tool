# NetworkEventFiringHandler

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg) throws java.lang.Exception`
- `public void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`

## Description

Use this handler as the only thing in your channel, to receive network events whenever your channel receives a message. Note: it will not forward on to other handlers.