# SPacketMultiBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketMultiBlockChange

## Class signature

```java
public class SPacketMultiBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketMultiBlockChange()`
- `SPacketMultiBlockChange(int p_i46959_1_, short[] p_i46959_2_, Chunk p_i46959_3_)`

## Methods

- `SPacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`