---
title: "S35PacketUpdateTileEntity"
description: "public class S35PacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S35PacketUpdateTileEntity.html"
sourceType: javadoc
---

# S35PacketUpdateTileEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S35PacketUpdateTileEntity

## Class signature

```java
public class S35PacketUpdateTileEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S35PacketUpdateTileEntity()`
- `S35PacketUpdateTileEntity(BlockPos blockPosIn, int metadataIn, NBTTagCompound nbtIn)`

## Methods

- `NBTTagCompound getNbtCompound()`
- `BlockPos getPos()`
- `int getTileEntityType()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
