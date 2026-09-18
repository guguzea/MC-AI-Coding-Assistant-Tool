---
title: "SPacketWindowProperty"
description: "public class SPacketWindowProperty extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketWindowProperty.html"
sourceType: javadoc
---

# SPacketWindowProperty

## Class signature

```java
public class SPacketWindowProperty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWindowProperty()`
- `public SPacketWindowProperty(int windowIdIn, int propertyIn, int valueIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getProperty()`
- `public int getValue()`
