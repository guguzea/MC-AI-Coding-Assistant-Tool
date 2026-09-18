---
title: "S02PacketChat"
description: "Returns the id of the area to display the text, 2 for above the action bar, anything else currently for the chat window"
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S02PacketChat.html"
sourceType: javadoc
---

# S02PacketChat

## Class signature

```java
public class S02PacketChat extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S02PacketChat()`
- `public S02PacketChat( IChatComponent component)`
- `public S02PacketChat( IChatComponent message, byte typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IChatComponent getChatComponent()`
- `public boolean isChat()`
- `public byte getType()`

## Description

Returns the id of the area to display the text, 2 for above the action bar, anything else currently for the chat window
