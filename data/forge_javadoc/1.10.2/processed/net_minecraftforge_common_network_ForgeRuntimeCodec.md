# ForgeRuntimeCodec

## Class signature

```java
public class ForgeRuntimeCodec extends FMLIndexedMessageToMessageCodec < ForgeMessage >
```

## Constructors

- `public ForgeRuntimeCodec()`

## Methods

- `public void encodeInto(io.netty.channel.ChannelHandlerContext ctx, ForgeMessage msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `public void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, ForgeMessage msg)`