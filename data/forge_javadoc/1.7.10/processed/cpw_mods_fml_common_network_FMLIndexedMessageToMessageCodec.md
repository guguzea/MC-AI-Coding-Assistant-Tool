# FMLIndexedMessageToMessageCodec

## Class signature

```java
public abstract class FMLIndexedMessageToMessageCodec<A> extends <any>
```

## Constructors

- `public FMLIndexedMessageToMessageCodec()`

## Methods

- `public void handlerAdded(ChannelHandlerContext ctx) throws java.lang.Exception`
- `public FMLIndexedMessageToMessageCodec < A > addDiscriminator(int discriminator, java.lang.Class<? extends A > type)`
- `public abstract void encodeInto(ChannelHandlerContext ctx, A msg, ByteBuf target) throws java.lang.Exception`
- `protected final void encode(ChannelHandlerContext ctx, A msg, java.util.List<java.lang.Object> out) throws java.lang.Exception`
- `public abstract void decodeInto(ChannelHandlerContext ctx, ByteBuf source, A msg)`
- `protected final void decode(ChannelHandlerContext ctx, FMLProxyPacket msg, java.util.List<java.lang.Object> out) throws java.lang.Exception`
- `protected void testMessageValidity( FMLProxyPacket msg)`
- `public void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`

## Description

Make this accessible to subclasses