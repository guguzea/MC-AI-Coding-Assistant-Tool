---
title: "S49PacketUpdateEntityNBT"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S49PacketUpdateEntityNBT.html"
sourceType: javadoc
---

# S49PacketUpdateEntityNBT

## Class signature

```java
public class S49PacketUpdateEntityNBT extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S49PacketUpdateEntityNBT()`
- `public S49PacketUpdateEntityNBT(int entityIdIn, NBTTagCompound tagCompoundIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public NBTTagCompound getTagCompound()`
- `public Entity getEntity( World worldIn)`

## Description

Passes this Packet on to the NetHandler for processing.
