---
title: "S11PacketSpawnExperienceOrb"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S11PacketSpawnExperienceOrb.html"
sourceType: javadoc
---

# S11PacketSpawnExperienceOrb

## Class signature

```java
public class S11PacketSpawnExperienceOrb extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S11PacketSpawnExperienceOrb()`
- `public S11PacketSpawnExperienceOrb( EntityXPOrb xpOrb)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public int getXPValue()`

## Description

Passes this Packet on to the NetHandler for processing.
