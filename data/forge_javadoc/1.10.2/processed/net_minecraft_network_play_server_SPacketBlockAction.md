# SPacketBlockAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketBlockAction

## Class signature

```java
public class SPacketBlockAction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketBlockAction()`
- `SPacketBlockAction(BlockPos pos, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `BlockPos getBlockPosition()`
- `Block getBlockType()`
- `int getData1()`
- `int getData2()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`