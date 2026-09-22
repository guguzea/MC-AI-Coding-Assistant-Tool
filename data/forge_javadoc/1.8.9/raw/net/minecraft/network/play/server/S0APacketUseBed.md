---
title: "S0APacketUseBed"
description: "public class S0APacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S0APacketUseBed.html"
sourceType: javadoc
---

# S0APacketUseBed

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0APacketUseBed

## Class signature

```java
public class S0APacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0APacketUseBed()`
- `S0APacketUseBed(EntityPlayer player, BlockPos bedPosIn)`

## Methods

- `BlockPos getBedPosition()`
- `EntityPlayer getPlayer(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
