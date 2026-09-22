---
title: "SPacketEntityProperties"
description: "public class SPacketEntityProperties extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketEntityProperties.html"
sourceType: javadoc
---

# SPacketEntityProperties

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityProperties

## Class signature

```java
public class SPacketEntityProperties extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityProperties()`
- `SPacketEntityProperties(int entityIdIn, java.util.Collection<IAttributeInstance> instances)`

## Methods

- `int getEntityId()`
- `java.util.List<SPacketEntityProperties.Snapshot> getSnapshots()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
