---
title: "SPacketEntityStatus"
description: "public class SPacketEntityStatus extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEntityStatus.html"
sourceType: javadoc
---

# SPacketEntityStatus

## Class signature

```java
public class SPacketEntityStatus extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityStatus()`
- `public SPacketEntityStatus( Entity entityIn, byte opcodeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getOpCode()`
