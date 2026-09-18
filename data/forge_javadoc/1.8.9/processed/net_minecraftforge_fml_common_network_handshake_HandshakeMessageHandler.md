# HandshakeMessageHandler

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S> & IHandshakeState <S>> extends <any>
```

## Constructors

- `public HandshakeMessageHandler(java.lang.Class< S > stateType)`

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, FMLHandshakeMessage msg) throws java.lang.Exception`
- `public void channelActive(ChannelHandlerContext ctx) throws java.lang.Exception`
- `public void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt) throws java.lang.Exception`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`