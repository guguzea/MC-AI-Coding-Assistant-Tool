# SimpleIndexedCodec

## Class signature

```java
public class SimpleIndexedCodec extends FMLIndexedMessageToMessageCodec < IMessage >
```

## Constructors

- `public SimpleIndexedCodec()`

## Methods

- `public void encodeInto(ChannelHandlerContext ctx, IMessage msg, ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(ChannelHandlerContext ctx, ByteBuf source, IMessage msg)`