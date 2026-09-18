---
title: "CPacketPlayerTryUseItemOnBlock"
description: "public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketPlayerTryUseItemOnBlock.html"
sourceType: javadoc
---

# CPacketPlayerTryUseItemOnBlock

## Class signature

```java
public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerTryUseItemOnBlock()`
- `public CPacketPlayerTryUseItemOnBlock( BlockPos posIn, EnumFacing placedBlockDirectionIn, EnumHand handIn, float facingXIn, float facingYIn, float facingZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPos()`
- `public EnumFacing getDirection()`
- `public EnumHand getHand()`
- `public float getFacingX()`
- `public float getFacingY()`
- `public float getFacingZ()`
