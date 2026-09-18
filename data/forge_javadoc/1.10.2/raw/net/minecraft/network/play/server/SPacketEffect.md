---
title: "SPacketEffect"
description: "public class SPacketEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEffect.html"
sourceType: javadoc
---

# SPacketEffect

## Class signature

```java
public class SPacketEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEffect()`
- `public SPacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public boolean isSoundServerwide()`
- `public int getSoundType()`
- `public int getSoundData()`
- `public BlockPos getSoundPos()`
