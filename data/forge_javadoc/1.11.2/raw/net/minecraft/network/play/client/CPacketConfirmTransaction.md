---
title: "CPacketConfirmTransaction"
description: "public class CPacketConfirmTransaction extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketConfirmTransaction.html"
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
