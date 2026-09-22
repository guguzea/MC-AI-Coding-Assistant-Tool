# S19PacketEntityStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S19PacketEntityStatus

## Class signature

```java
public class S19PacketEntityStatus extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S19PacketEntityStatus()`
- `S19PacketEntityStatus(Entity entityIn, byte opCodeIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getOpCode()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.