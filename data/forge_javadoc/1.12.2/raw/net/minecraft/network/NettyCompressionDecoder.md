---
title: "NettyCompressionDecoder"
description: "public class NettyCompressionDecoder extends ByteToMessageDecoder"
package: "net/minecraft/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/NettyCompressionDecoder.html"
sourceType: javadoc
---

# NettyCompressionDecoder

## Class signature

```java
public class NettyCompressionDecoder extends ByteToMessageDecoder
```

## Constructors

- `public NettyCompressionDecoder(int thresholdIn)`

## Methods

- `protected void decode(ChannelHandlerContext p_decode_1_, ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_) throws java.util.zip.DataFormatException, java.lang.Exception`
- `public void setCompressionThreshold(int thresholdIn)`
