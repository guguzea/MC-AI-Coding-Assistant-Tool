# HandshakeMessageHandler

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends io.netty.channel.SimpleChannelInboundHandler< FMLHandshakeMessage >
```

## Constructors

- `public HandshakeMessageHandler(java.lang.Class< S > stateType)`

## Methods

- `protected void channelRead0(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg) throws java.lang.Exception`
- `public void channelActive(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void userEventTriggered(io.netty.channel.ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`