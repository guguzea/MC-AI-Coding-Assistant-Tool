# S28PacketEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S28PacketEffect

## Class signature

```java
public class S28PacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S28PacketEffect()`
- `S28PacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `int getSoundData()`
- `BlockPos getSoundPos()`
- `int getSoundType()`
- `boolean isSoundServerwide()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.