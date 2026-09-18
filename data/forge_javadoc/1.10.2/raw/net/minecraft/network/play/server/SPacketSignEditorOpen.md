---
title: "SPacketSignEditorOpen"
description: "public class SPacketSignEditorOpen extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketSignEditorOpen.html"
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
