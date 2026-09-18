---
title: "SPacketUpdateTileEntity"
description: "public class SPacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUpdateTileEntity.html"
sourceType: javadoc
---

# SPacketUpdateTileEntity

## Class signature

```java
public class SPacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateTileEntity()`
- `public SPacketUpdateTileEntity( BlockPos blockPosIn, int tileEntityTypeIn, NBTTagCompound compoundIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getPos()`
- `public int getTileEntityType()`
- `public NBTTagCompound getNbtCompound()`
