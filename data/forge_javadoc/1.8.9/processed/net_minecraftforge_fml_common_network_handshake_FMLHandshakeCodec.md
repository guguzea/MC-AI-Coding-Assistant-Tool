# FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec < FMLHandshakeMessage >
```

## Constructors

- `public FMLHandshakeCodec()`

## Methods

- `public void encodeInto(ChannelHandlerContext ctx, FMLHandshakeMessage msg, ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLHandshakeMessage msg)`