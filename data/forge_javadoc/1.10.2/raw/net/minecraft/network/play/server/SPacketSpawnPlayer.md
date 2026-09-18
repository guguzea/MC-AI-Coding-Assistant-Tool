---
title: "SPacketSpawnPlayer"
description: "public class SPacketSpawnPlayer extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketSpawnPlayer.html"
sourceType: javadoc
---

# SPacketSpawnPlayer

## Class signature

```java
public class SPacketSpawnPlayer extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnPlayer()`
- `public SPacketSpawnPlayer( EntityPlayer player)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `@Nullable public java.util.List< EntityDataManager.DataEntry <?>> getDataManagerEntries()`
- `public int getEntityID()`
- `public java.util.UUID getUniqueId()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
