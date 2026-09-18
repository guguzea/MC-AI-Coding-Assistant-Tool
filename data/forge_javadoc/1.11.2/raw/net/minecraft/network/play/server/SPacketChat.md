---
title: "SPacketChat"
description: "public class SPacketChat extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketChat.html"
sourceType: javadoc
---

# SPacketChat

## Class signature

```java
public class SPacketChat extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketChat()`
- `public SPacketChat( ITextComponent componentIn)`
- `public SPacketChat( ITextComponent componentIn, byte typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ITextComponent getChatComponent()`
- `public boolean isSystem()`
- `public byte getType()`
