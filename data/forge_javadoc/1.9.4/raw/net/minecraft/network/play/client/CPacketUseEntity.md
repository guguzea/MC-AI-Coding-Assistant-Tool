---
title: "CPacketUseEntity"
description: "public class CPacketUseEntity extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketUseEntity.html"
sourceType: javadoc
---

# CPacketUseEntity

## Class signature

```java
public class CPacketUseEntity extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketUseEntity()`
- `public CPacketUseEntity( Entity entityIn)`
- `public CPacketUseEntity( Entity entityIn, EnumHand handIn)`
- `public CPacketUseEntity( Entity entityIn, EnumHand handIn, Vec3d hitVecIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public Entity getEntityFromWorld( World worldIn)`
- `public CPacketUseEntity.Action getAction()`
- `public EnumHand getHand()`
- `public Vec3d getHitVec()`
