---
title: "C01PacketChatMessage"
description: "public class C01PacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C01PacketChatMessage.html"
sourceType: javadoc
---

# C01PacketChatMessage

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C01PacketChatMessage

## Class signature

```java
public class C01PacketChatMessage extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C01PacketChatMessage()`
- `C01PacketChatMessage(java.lang.String messageIn)`

## Methods

- `java.lang.String getMessage()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
