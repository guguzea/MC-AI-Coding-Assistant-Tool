# SPacketTimeUpdate

## Class signature

```java
public class SPacketTimeUpdate extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTimeUpdate()`
- `public SPacketTimeUpdate(long totalWorldTimeIn, long worldTimeIn, boolean doDaylightCycle)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public long getTotalWorldTime()`
- `public long getWorldTime()`