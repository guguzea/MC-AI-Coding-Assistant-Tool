# CPacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketTabComplete

## Class signature

```java
public class CPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketTabComplete()`
- `CPacketTabComplete(java.lang.String messageIn, BlockPos targetBlockIn, boolean hasTargetBlockIn)`

## Methods

- `java.lang.String getMessage()`
- `BlockPos getTargetBlock()`
- `boolean hasTargetBlock()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`