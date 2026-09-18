---
title: "NettyEncryptionTranslator"
description: "public class NettyEncryptionTranslator extends java.lang.Object"
package: "net/minecraft/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/NettyEncryptionTranslator.html"
sourceType: javadoc
---

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
