# S06PacketUpdateHealth

## Class signature

```java
public class S06PacketUpdateHealth extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S06PacketUpdateHealth()`
- `public S06PacketUpdateHealth(float healthIn, int foodLevelIn, float saturationIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getHealth()`
- `public int getFoodLevel()`
- `public float getSaturationLevel()`

## Description

Passes this Packet on to the NetHandler for processing.