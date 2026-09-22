---
title: "CPacketEntityAction"
description: "public class CPacketEntityAction extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketEntityAction.html"
sourceType: javadoc
---

# CPacketEntityAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketEntityAction

## Class signature

```java
public class CPacketEntityAction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketEntityAction()`
- `CPacketEntityAction(Entity entityIn, CPacketEntityAction.Action actionIn)`
- `CPacketEntityAction(Entity entityIn, CPacketEntityAction.Action actionIn, int auxDataIn)`

## Methods

- `CPacketEntityAction.Action getAction()`
- `int getAuxData()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
