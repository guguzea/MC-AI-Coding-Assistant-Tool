# SimpleChannelHandlerWrapper

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.simpleimpl.SimpleChannelHandlerWrapper<REQ, REPLY>

## Class signature

```java
public class SimpleChannelHandlerWrapper<REQ extends IMessage, REPLY extends IMessage> extends<any>
```

## Constructors

- `SimpleChannelHandlerWrapper(java.lang.Class<? extends IMessageHandler<? super REQ, ? extends REPLY>> handler, Side side, java.lang.Class<REQ> requestType)`
- `SimpleChannelHandlerWrapper(IMessageHandler<? super REQ, ? extends REPLY> handler, Side side, java.lang.Class<REQ> requestType)`

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, REQ msg)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`