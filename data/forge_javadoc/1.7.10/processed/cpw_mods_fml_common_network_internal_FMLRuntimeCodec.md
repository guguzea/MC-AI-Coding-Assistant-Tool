# FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec < FMLMessage >
```

## Constructors

- `public FMLRuntimeCodec()`

## Methods

- `public void encodeInto(ChannelHandlerContext ctx, FMLMessage msg, ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(ChannelHandlerContext ctx, ByteBuf source, FMLMessage msg)`
- `protected void testMessageValidity( FMLProxyPacket msg)`

## Description

Called to verify the message received.