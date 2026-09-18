---
title: "SPacketSignEditorOpen"
description: "public class SPacketSignEditorOpen extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketSignEditorOpen.html"
sourceType: javadoc
---

# SPacketSignEditorOpen

## Class signature

```java
public class SPacketSignEditorOpen extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSignEditorOpen()`
- `public SPacketSignEditorOpen( BlockPos posIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public BlockPos getSignPosition()`
