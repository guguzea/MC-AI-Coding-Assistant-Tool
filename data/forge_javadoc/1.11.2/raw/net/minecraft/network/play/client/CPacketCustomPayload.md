---
title: "CPacketCustomPayload"
description: "public class CPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketCustomPayload.html"
sourceType: javadoc
---

# CPacketCustomPayload

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketCustomPayload

## Class signature

```java
public class CPacketCustomPayload extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketCustomPayload()`
- `CPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `PacketBuffer getBufferData()`
- `java.lang.String getChannelName()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
