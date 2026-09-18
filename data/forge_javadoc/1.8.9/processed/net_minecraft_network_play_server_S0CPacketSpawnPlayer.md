# S0CPacketSpawnPlayer

## Class signature

```java
public class S0CPacketSpawnPlayer extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0CPacketSpawnPlayer()`
- `public S0CPacketSpawnPlayer( EntityPlayer player)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< DataWatcher.WatchableObject > func_148944_c()`
- `public int getEntityID()`
- `public java.util.UUID getPlayer()`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public int getCurrentItemID()`

## Description

Passes this Packet on to the NetHandler for processing.