# S29PacketSoundEffect

## Class signature

```java
public class S29PacketSoundEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S29PacketSoundEffect()`
- `public S29PacketSoundEffect(java.lang.String soundNameIn, double soundX, double soundY, double soundZ, float volume, float pitch)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.lang.String getSoundName()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getVolume()`
- `public float getPitch()`

## Description

Passes this Packet on to the NetHandler for processing.