---
title: "SPacketUpdateTileEntity"
description: "public class SPacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketUpdateTileEntity.html"
sourceType: javadoc
---

# SPacketUpdateTileEntity

## Class signature

```java
public class SPacketUpdateTileEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateTileEntity()`
- `public SPacketUpdateTileEntity( BlockPos blockPosIn, int metadataIn, NBTTagCompound compoundIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getPos()`
- `public int getTileEntityType()`
- `public NBTTagCompound getNbtCompound()`
