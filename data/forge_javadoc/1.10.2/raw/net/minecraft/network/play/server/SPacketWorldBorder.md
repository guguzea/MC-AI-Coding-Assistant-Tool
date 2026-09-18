---
title: "SPacketWorldBorder"
description: "public class SPacketWorldBorder extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketWorldBorder.html"
sourceType: javadoc
---

# SPacketWorldBorder

## Class signature

```java
public class SPacketWorldBorder extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWorldBorder()`
- `public SPacketWorldBorder( WorldBorder border, SPacketWorldBorder.Action actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public void apply( WorldBorder border)`
