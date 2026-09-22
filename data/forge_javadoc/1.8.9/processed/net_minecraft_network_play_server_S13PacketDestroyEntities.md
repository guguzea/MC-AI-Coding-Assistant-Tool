# S13PacketDestroyEntities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S13PacketDestroyEntities

## Class signature

```java
public class S13PacketDestroyEntities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S13PacketDestroyEntities()`
- `S13PacketDestroyEntities(int... entityIDsIn)`

## Methods

- `int[] getEntityIDs()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.