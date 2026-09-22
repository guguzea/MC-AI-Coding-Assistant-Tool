# S1FPacketSetExperience

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S1FPacketSetExperience

## Class signature

```java
public class S1FPacketSetExperience extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S1FPacketSetExperience()`
- `S1FPacketSetExperience(float p_i45222_1_, int totalExperienceIn, int levelIn)`

## Methods

- `float func_149397_c()`
- `int getLevel()`
- `int getTotalExperience()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.