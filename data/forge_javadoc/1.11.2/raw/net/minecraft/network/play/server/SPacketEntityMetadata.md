---
title: "SPacketEntityMetadata"
description: "public class SPacketEntityMetadata extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketEntityMetadata.html"
sourceType: javadoc
---

# SPacketEntityMetadata

## Class signature

```java
public class SPacketEntityMetadata extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityMetadata()`
- `public SPacketEntityMetadata(int entityIdIn, EntityDataManager dataManagerIn, boolean sendAll)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< EntityDataManager.DataEntry <?>> getDataManagerEntries()`
- `public int getEntityId()`
