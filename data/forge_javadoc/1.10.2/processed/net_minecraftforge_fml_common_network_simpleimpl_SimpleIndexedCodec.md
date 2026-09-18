# SimpleIndexedCodec

## Class signature

```java
public class SimpleIndexedCodec extends FMLIndexedMessageToMessageCodec < IMessage >
```

## Constructors

- `public SimpleIndexedCodec()`

## Methods

- `public void encodeInto(io.netty.channel.ChannelHandlerContext ctx, IMessage msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, IMessage msg)`