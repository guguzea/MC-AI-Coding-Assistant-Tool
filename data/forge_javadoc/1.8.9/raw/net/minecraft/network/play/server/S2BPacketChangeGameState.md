---
title: "S2BPacketChangeGameState"
description: "public class S2BPacketChangeGameState extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2BPacketChangeGameState.html"
sourceType: javadoc
---

# S2BPacketChangeGameState

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2BPacketChangeGameState

## Class signature

```java
public class S2BPacketChangeGameState extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2BPacketChangeGameState()`
- `S2BPacketChangeGameState(int stateIn, float p_i45194_2_)`

## Methods

- `float func_149137_d()`
- `int getGameState()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `static java.lang.String[] MESSAGE_NAMES`
