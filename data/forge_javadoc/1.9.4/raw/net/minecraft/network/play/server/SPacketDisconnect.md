---
title: "SPacketDisconnect"
description: "public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketDisconnect.html"
sourceType: javadoc
---

# SPacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketDisconnect()`
- `SPacketDisconnect(ITextComponent messageIn)`

## Methods

- `ITextComponent getReason()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
