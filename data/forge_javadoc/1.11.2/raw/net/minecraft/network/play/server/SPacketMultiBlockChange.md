---
title: "SPacketMultiBlockChange"
description: "public class SPacketMultiBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketMultiBlockChange.html"
sourceType: javadoc
---

# SPacketMultiBlockChange

## Class signature

```java
public class SPacketMultiBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketMultiBlockChange()`
- `public SPacketMultiBlockChange(int p_i46959_1_, short[] p_i46959_2_, Chunk p_i46959_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public SPacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`
