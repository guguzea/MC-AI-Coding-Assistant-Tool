---
title: "NettyEncryptionTranslator"
description: "public class NettyEncryptionTranslator extends java.lang.Object"
package: "net/minecraft/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/NettyEncryptionTranslator.html"
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

- `protected io.netty.buffer.ByteBuf decipher(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf buffer) throws javax.crypto.ShortBufferException`
- `protected void cipher(io.netty.buffer.ByteBuf in, io.netty.buffer.ByteBuf out) throws javax.crypto.ShortBufferException`
