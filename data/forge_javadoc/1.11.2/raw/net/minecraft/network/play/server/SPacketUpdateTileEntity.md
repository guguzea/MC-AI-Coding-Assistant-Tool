---
title: "SPacketUpdateTileEntity"
description: "public class SPacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUpdateTileEntity.html"
sourceType: javadoc
---

# SPacketUpdateTileEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateTileEntity

## Class signature

```java
public class SPacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateTileEntity()`
- `SPacketUpdateTileEntity(BlockPos blockPosIn, int tileEntityTypeIn, NBTTagCompound compoundIn)`

## Methods

- `NBTTagCompound getNbtCompound()`
- `BlockPos getPos()`
- `int getTileEntityType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
