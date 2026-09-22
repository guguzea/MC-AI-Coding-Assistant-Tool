---
title: "SPacketEntityMetadata"
description: "public class SPacketEntityMetadata extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityMetadata.html"
sourceType: javadoc
---

# SPacketEntityMetadata

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityMetadata

## Class signature

```java
public class SPacketEntityMetadata extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityMetadata()`
- `SPacketEntityMetadata(int entityIdIn, EntityDataManager dataManagerIn, boolean sendAll)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
