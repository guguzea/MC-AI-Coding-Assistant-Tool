---
title: "C0DPacketCloseWindow"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C0DPacketCloseWindow.html"
sourceType: javadoc
---

# C0DPacketCloseWindow

## Class signature

```java
public class C0DPacketCloseWindow extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0DPacketCloseWindow()`
- `public C0DPacketCloseWindow(int windowId)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`

## Description

Passes this Packet on to the NetHandler for processing.
