---
title: "SPacketChat"
description: "public class SPacketChat extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketChat.html"
sourceType: javadoc
---

# SPacketChat

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketChat

## Class signature

```java
public class SPacketChat extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketChat()`
- `SPacketChat(ITextComponent componentIn)`
- `SPacketChat(ITextComponent componentIn, byte typeIn)`

## Methods

- `ITextComponent getChatComponent()`
- `byte getType()`
- `boolean isSystem()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
