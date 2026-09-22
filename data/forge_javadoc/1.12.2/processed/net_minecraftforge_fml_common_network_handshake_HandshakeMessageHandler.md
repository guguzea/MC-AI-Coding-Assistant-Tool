# HandshakeMessageHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.handshake.HandshakeMessageHandler<S>

## Class signature

```java
public class HandshakeMessageHandler<S extends java.lang.Enum<S>& IHandshakeState<S>> extends<any>
```

## Constructors

- `HandshakeMessageHandler(java.lang.Class<S> stateType)`

## Methods

- `void channelActive(ChannelHandlerContext ctx)`
- `protected void channelRead0(ChannelHandlerContext ctx, FMLHandshakeMessage msg)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void userEventTriggered(ChannelHandlerContext ctx, java.lang.Object evt)`