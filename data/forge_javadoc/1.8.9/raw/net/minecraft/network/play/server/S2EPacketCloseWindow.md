---
title: "S2EPacketCloseWindow"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2EPacketCloseWindow.html"
sourceType: javadoc
---

# S2EPacketCloseWindow

## Class signature

```java
public class S2EPacketCloseWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2EPacketCloseWindow()`
- `public S2EPacketCloseWindow(int windowIdIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`

## Description

Passes this Packet on to the NetHandler for processing.
