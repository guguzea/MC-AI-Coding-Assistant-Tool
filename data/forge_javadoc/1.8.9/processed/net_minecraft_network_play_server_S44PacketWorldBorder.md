# S44PacketWorldBorder

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S44PacketWorldBorder

## Class signature

```java
public class S44PacketWorldBorder extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S44PacketWorldBorder()`
- `S44PacketWorldBorder(WorldBorder border, S44PacketWorldBorder.Action actionIn)`

## Methods

- `void func_179788_a(WorldBorder border)`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.