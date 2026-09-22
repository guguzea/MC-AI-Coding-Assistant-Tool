# S20PacketEntityProperties

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S20PacketEntityProperties

## Class signature

```java
public class S20PacketEntityProperties extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S20PacketEntityProperties()`
- `S20PacketEntityProperties(int entityIdIn, java.util.Collection<IAttributeInstance> p_i45236_2_)`

## Methods

- `java.util.List<S20PacketEntityProperties.Snapshot> func_149441_d()`
- `int getEntityId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.