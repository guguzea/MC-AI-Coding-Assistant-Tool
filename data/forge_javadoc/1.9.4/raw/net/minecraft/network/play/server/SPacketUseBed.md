---
title: "SPacketUseBed"
description: "public class SPacketUseBed extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketUseBed.html"
sourceType: javadoc
---

# SPacketUseBed

## Class signature

```java
public class SPacketUseBed extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUseBed()`
- `public SPacketUseBed( EntityPlayer player, BlockPos posIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public EntityPlayer getPlayer( World worldIn)`
- `public BlockPos getBedPosition()`
