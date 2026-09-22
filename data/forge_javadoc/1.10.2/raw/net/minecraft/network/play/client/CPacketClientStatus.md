---
title: "CPacketClientStatus"
description: "public class CPacketClientStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketClientStatus.html"
sourceType: javadoc
---

# CPacketClientStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketClientStatus

## Class signature

```java
public class CPacketClientStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketClientStatus()`
- `CPacketClientStatus(CPacketClientStatus.State p_i46886_1_)`

## Methods

- `CPacketClientStatus.State getStatus()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
