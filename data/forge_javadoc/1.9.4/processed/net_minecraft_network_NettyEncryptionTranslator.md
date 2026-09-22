# NettyEncryptionTranslator

**Inheritance:** java.lang.Object → net.minecraft.network.NettyEncryptionTranslator

## Class signature

```java
public class NettyEncryptionTranslator extends java.lang.Object
```

## Constructors

- `NettyEncryptionTranslator(javax.crypto.Cipher cipherIn)`

## Methods

- `protected void cipher(io.netty.buffer.ByteBuf in, io.netty.buffer.ByteBuf out)`
- `protected io.netty.buffer.ByteBuf decipher(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf buffer)`