---
title: "CPacketChatMessage"
description: "public class CPacketChatMessage extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketChatMessage.html"
sourceType: javadoc
---

# CPacketChatMessage

## Class signature

```java
public class CPacketChatMessage extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketChatMessage()`
- `public CPacketChatMessage(java.lang.String messageIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`
