---
title: "CPacketConfirmTransaction"
description: "public class CPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketConfirmTransaction.html"
sourceType: javadoc
---

# CPacketConfirmTransaction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketConfirmTransaction

## Class signature

```java
public class CPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketConfirmTransaction()`
- `CPacketConfirmTransaction(int windowIdIn, short uidIn, boolean acceptedIn)`

## Methods

- `short getUid()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
