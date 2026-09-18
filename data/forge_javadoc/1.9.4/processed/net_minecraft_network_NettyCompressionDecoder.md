# NettyCompressionDecoder

## Class signature

```java
public class NettyCompressionDecoder extends io.netty.handler.codec.ByteToMessageDecoder
```

## Constructors

- `public NettyCompressionDecoder(int thresholdIn)`

## Methods

- `protected void decode(io.netty.channel.ChannelHandlerContext p_decode_1_, io.netty.buffer.ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_) throws java.util.zip.DataFormatException, java.lang.Exception`
- `public void setCompressionThreshold(int thresholdIn)`