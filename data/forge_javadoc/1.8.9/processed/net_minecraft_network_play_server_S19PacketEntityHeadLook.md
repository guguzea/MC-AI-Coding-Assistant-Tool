# S19PacketEntityHeadLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S19PacketEntityHeadLook

## Class signature

```java
public class S19PacketEntityHeadLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S19PacketEntityHeadLook()`
- `S19PacketEntityHeadLook(Entity entityIn, byte p_i45214_2_)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getYaw()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.