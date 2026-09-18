# FMLHandshakeCodec

## Class signature

```java
public class FMLHandshakeCodec extends FMLIndexedMessageToMessageCodec < FMLHandshakeMessage >
```

## Constructors

- `public FMLHandshakeCodec()`

## Methods

- `public void encodeInto(io.netty.channel.ChannelHandlerContext ctx, FMLHandshakeMessage msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, FMLHandshakeMessage msg)`