---
title: "SPacketConfirmTransaction"
description: "public class SPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketConfirmTransaction.html"
sourceType: javadoc
---

# SPacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketConfirmTransaction

## Class signature

```java
public class SPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketConfirmTransaction()`
- `SPacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean acceptedIn)`

## Methods

- `short getActionNumber()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `boolean wasAccepted()`
- `void writePacketData(PacketBuffer buf)`
