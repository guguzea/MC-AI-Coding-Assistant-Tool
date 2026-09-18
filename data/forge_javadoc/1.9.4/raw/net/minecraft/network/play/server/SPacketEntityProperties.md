---
title: "SPacketEntityProperties"
description: "public class SPacketEntityProperties extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityProperties.html"
sourceType: javadoc
---

# SPacketEntityProperties

## Class signature

```java
public class SPacketEntityProperties extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityProperties()`
- `public SPacketEntityProperties(int entityIdIn, java.util.Collection< IAttributeInstance > instances)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public java.util.List< SPacketEntityProperties.Snapshot > getSnapshots()`
