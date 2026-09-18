# NettyEncryptionTranslator

## Class signature

```java
public class NettyEncryptionTranslator extends java.lang.Object
```

## Constructors

- `protected NettyEncryptionTranslator(javax.crypto.Cipher cipherIn)`

## Methods

- `protected io.netty.buffer.ByteBuf decipher(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf buffer) throws javax.crypto.ShortBufferException`
- `protected void cipher(io.netty.buffer.ByteBuf in, io.netty.buffer.ByteBuf out) throws javax.crypto.ShortBufferException`