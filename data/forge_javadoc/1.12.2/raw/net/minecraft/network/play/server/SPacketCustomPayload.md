---
title: "SPacketCustomPayload"
description: "public class SPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCustomPayload.html"
sourceType: javadoc
---

# SPacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCustomPayload

## Class signature

```java
public class SPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCustomPayload()`
- `SPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
