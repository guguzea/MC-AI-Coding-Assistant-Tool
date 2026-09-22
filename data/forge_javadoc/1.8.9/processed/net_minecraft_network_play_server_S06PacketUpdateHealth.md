# S06PacketUpdateHealth

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S06PacketUpdateHealth

## Class signature

```java
public class S06PacketUpdateHealth extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S06PacketUpdateHealth()`
- `S06PacketUpdateHealth(float healthIn, int foodLevelIn, float saturationIn)`

## Methods

- `int getFoodLevel()`
- `float getHealth()`
- `float getSaturationLevel()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.