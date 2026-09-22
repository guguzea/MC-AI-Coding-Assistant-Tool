---
title: "NettyEncryptionTranslator"
description: "public class NettyEncryptionTranslator extends java.lang.Object"
package: "net/minecraft/network"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/NettyEncryptionTranslator.html"
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

- `protected void cipher(ByteBuf in, ByteBuf out)`
- `protected ByteBuf decipher(ChannelHandlerContext ctx, ByteBuf buffer)`
