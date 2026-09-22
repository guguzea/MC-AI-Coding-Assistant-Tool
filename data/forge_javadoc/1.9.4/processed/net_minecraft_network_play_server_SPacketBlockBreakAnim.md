# SPacketBlockBreakAnim

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketBlockBreakAnim

## Class signature

```java
public class SPacketBlockBreakAnim extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketBlockBreakAnim()`
- `SPacketBlockBreakAnim(int breakerIdIn, BlockPos positionIn, int progressIn)`

## Methods

- `int getBreakerId()`
- `BlockPos getPosition()`
- `int getProgress()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`