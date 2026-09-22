# S1EPacketRemoveEntityEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S1EPacketRemoveEntityEffect

## Class signature

```java
public class S1EPacketRemoveEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S1EPacketRemoveEntityEffect()`
- `S1EPacketRemoveEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `int getEffectId()`
- `int getEntityId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.