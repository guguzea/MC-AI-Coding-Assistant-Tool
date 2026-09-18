# NettyCompressionEncoder

## Class signature

```java
public class NettyCompressionEncoder extends io.netty.handler.codec.MessageToByteEncoder<io.netty.buffer.ByteBuf>
```

## Constructors

- `public NettyCompressionEncoder(int thresholdIn)`

## Methods

- `protected void encode(io.netty.channel.ChannelHandlerContext p_encode_1_, io.netty.buffer.ByteBuf p_encode_2_, io.netty.buffer.ByteBuf p_encode_3_) throws java.lang.Exception`
- `public void setCompressionThreshold(int thresholdIn)`