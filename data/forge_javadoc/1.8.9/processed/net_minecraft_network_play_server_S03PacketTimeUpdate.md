# S03PacketTimeUpdate

## Class signature

```java
public class S03PacketTimeUpdate extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S03PacketTimeUpdate()`
- `public S03PacketTimeUpdate(long totalWorldTimeIn, long totalTimeIn, boolean doDayLightCycle)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public long getTotalWorldTime()`
- `public long getWorldTime()`

## Description

Passes this Packet on to the NetHandler for processing.