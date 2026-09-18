# SPacketStatistics

## Class signature

```java
public class SPacketStatistics extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketStatistics()`
- `public SPacketStatistics(java.util.Map< StatBase ,java.lang.Integer> statisticMapIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.util.Map< StatBase ,java.lang.Integer> getStatisticMap()`