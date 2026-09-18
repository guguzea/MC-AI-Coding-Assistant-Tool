# SimpleChannelHandlerWrapper

## Class signature

```java
public class SimpleChannelHandlerWrapper<REQ extends IMessage ,REPLY extends IMessage > extends <any>
```

## Constructors

- `public SimpleChannelHandlerWrapper(java.lang.Class<? extends IMessageHandler <? super REQ ,? extends REPLY >> handler, Side side, java.lang.Class< REQ > requestType)`
- `public SimpleChannelHandlerWrapper( IMessageHandler <? super REQ ,? extends REPLY > handler, Side side, java.lang.Class< REQ > requestType)`

## Methods

- `protected void channelRead0(ChannelHandlerContext ctx, REQ msg) throws java.lang.Exception`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`