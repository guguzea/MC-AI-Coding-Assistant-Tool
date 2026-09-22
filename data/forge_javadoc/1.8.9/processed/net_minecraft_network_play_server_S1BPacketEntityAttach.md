# S1BPacketEntityAttach

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S1BPacketEntityAttach

## Class signature

```java
public class S1BPacketEntityAttach extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S1BPacketEntityAttach()`
- `S1BPacketEntityAttach(int leashIn, Entity entityIn, Entity vehicle)`

## Methods

- `int getEntityId()`
- `int getLeash()`
- `int getVehicleEntityId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.