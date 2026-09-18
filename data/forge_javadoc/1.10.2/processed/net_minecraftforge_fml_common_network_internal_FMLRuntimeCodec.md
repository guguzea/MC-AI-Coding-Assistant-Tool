# FMLRuntimeCodec

## Class signature

```java
public class FMLRuntimeCodec extends FMLIndexedMessageToMessageCodec < FMLMessage >
```

## Constructors

- `public FMLRuntimeCodec()`

## Methods

- `public void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLMessage msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLMessage msg)`
- `protected void testMessageValidity( FMLProxyPacket msg)`

## Description

Called to verify the message received.