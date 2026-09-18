# NettyEncryptionTranslator

## Class signature

```java
public class NettyEncryptionTranslator extends java.lang.Object
```

## Constructors

- `protected NettyEncryptionTranslator(javax.crypto.Cipher cipherIn)`

## Methods

- `protected ByteBuf decipher(ChannelHandlerContext ctx, ByteBuf buffer) throws javax.crypto.ShortBufferException`
- `protected void cipher(ByteBuf in, ByteBuf out) throws javax.crypto.ShortBufferException`