# S43PacketCamera

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S43PacketCamera

## Class signature

```java
public class S43PacketCamera extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S43PacketCamera()`
- `S43PacketCamera(Entity entityIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `int entityId`