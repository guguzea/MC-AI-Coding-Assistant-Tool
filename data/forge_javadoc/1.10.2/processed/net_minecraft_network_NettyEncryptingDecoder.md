# NettyEncryptingDecoder

## Class signature

```java
public class NettyEncryptingDecoder extends io.netty.handler.codec.MessageToMessageDecoder<io.netty.buffer.ByteBuf>
```

## Constructors

- `public NettyEncryptingDecoder(javax.crypto.Cipher cipher)`

## Methods

- `protected void decode(io.netty.channel.ChannelHandlerContext p_decode_1_, io.netty.buffer.ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_) throws javax.crypto.ShortBufferException, java.lang.Exception`