# SPacketStatistics

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketStatistics

## Class signature

```java
public class SPacketStatistics extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketStatistics()`
- `SPacketStatistics(java.util.Map<StatBase, java.lang.Integer> statisticMapIn)`

## Methods

- `java.util.Map<StatBase, java.lang.Integer> getStatisticMap()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`