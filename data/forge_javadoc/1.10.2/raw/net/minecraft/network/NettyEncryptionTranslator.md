---
title: "NettyEncryptionTranslator"
description: "public class NettyEncryptionTranslator extends java.lang.Object"
package: "net/minecraft/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/NettyEncryptionTranslator.html"
sourceType: javadoc
---

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
