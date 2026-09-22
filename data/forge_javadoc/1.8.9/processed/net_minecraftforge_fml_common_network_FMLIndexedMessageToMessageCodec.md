# FMLIndexedMessageToMessageCodec

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.network.FMLIndexedMessageToMessageCodec<A>

## Class signature

```java
public abstract class FMLIndexedMessageToMessageCodec<A> extends<any>
```

## Constructors

- `FMLIndexedMessageToMessageCodec()`

## Methods

- `FMLIndexedMessageToMessageCodec<A> addDiscriminator(int discriminator, java.lang.Class<? extends A> type)`
- `protected void decode(ChannelHandlerContext ctx, FMLProxyPacket msg, java.util.List<java.lang.Object> out)`
- `abstract void decodeInto(ChannelHandlerContext ctx, ByteBuf source, A msg)`
- `protected void encode(ChannelHandlerContext ctx, A msg, java.util.List<java.lang.Object> out)`
- `abstract void encodeInto(ChannelHandlerContext ctx, A msg, ByteBuf target)`
- `void exceptionCaught(ChannelHandlerContext ctx, java.lang.Throwable cause)`
- `void handlerAdded(ChannelHandlerContext ctx)`
- `protected void testMessageValidity(FMLProxyPacket msg)` — Called to verify the message received.

## Fields

- `static<any> INBOUNDPACKETTRACKER` — Make this accessible to subclasses