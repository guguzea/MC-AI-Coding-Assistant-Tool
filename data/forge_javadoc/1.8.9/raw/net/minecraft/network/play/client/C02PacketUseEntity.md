---
title: "C02PacketUseEntity"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C02PacketUseEntity.html"
sourceType: javadoc
---

# C02PacketUseEntity

## Class signature

```java
public class C02PacketUseEntity extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C02PacketUseEntity()`
- `public C02PacketUseEntity( Entity entity, C02PacketUseEntity.Action action)`
- `public C02PacketUseEntity( Entity entity, Vec3 hitVec)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public Entity getEntityFromWorld( World worldIn)`
- `public C02PacketUseEntity.Action getAction()`
- `public Vec3 getHitVec()`

## Description

Passes this Packet on to the NetHandler for processing.
