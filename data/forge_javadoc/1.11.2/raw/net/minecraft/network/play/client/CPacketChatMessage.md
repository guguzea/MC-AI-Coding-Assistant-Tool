---
title: "CPacketChatMessage"
description: "public class CPacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketChatMessage.html"
sourceType: javadoc
---

# CPacketChatMessage

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketChatMessage

## Class signature

```java
public class CPacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketChatMessage()`
- `CPacketChatMessage(java.lang.String messageIn)`

## Methods

- `java.lang.String getMessage()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
