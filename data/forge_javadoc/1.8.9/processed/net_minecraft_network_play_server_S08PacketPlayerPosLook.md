# S08PacketPlayerPosLook

## Class signature

```java
public class S08PacketPlayerPosLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S08PacketPlayerPosLook()`
- `public S08PacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set< S08PacketPlayerPosLook.EnumFlags > p_i45993_9_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`
- `public java.util.Set< S08PacketPlayerPosLook.EnumFlags > func_179834_f()`

## Description

Passes this Packet on to the NetHandler for processing.