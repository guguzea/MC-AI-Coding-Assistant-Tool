# C14PacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C14PacketTabComplete

## Class signature

```java
public class C14PacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C14PacketTabComplete()`
- `C14PacketTabComplete(java.lang.String msg)`
- `C14PacketTabComplete(java.lang.String msg, BlockPos target)`

## Methods

- `java.lang.String getMessage()`
- `BlockPos getTargetBlock()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.