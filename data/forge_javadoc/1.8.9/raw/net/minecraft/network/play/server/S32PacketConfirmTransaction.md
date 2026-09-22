---
title: "S32PacketConfirmTransaction"
description: "public class S32PacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S32PacketConfirmTransaction.html"
sourceType: javadoc
---

# S32PacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S32PacketConfirmTransaction

## Class signature

```java
public class S32PacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S32PacketConfirmTransaction()`
- `S32PacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean p_i45182_3_)`

## Methods

- `boolean func_148888_e()`
- `short getActionNumber()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
