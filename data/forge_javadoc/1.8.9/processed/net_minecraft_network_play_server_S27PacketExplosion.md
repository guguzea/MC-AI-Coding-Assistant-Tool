# S27PacketExplosion

## Class signature

```java
public class S27PacketExplosion extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S27PacketExplosion()`
- `public S27PacketExplosion(double p_i45193_1_, double y, double z, float strengthIn, java.util.List< BlockPos > affectedBlocksIn, Vec3 p_i45193_9_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float func_149149_c()`
- `public float func_149144_d()`
- `public float func_149147_e()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getStrength()`
- `public java.util.List< BlockPos > getAffectedBlockPositions()`

## Description

Passes this Packet on to the NetHandler for processing.