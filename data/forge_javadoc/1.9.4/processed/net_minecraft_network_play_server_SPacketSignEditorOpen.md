# SPacketSignEditorOpen

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSignEditorOpen

## Class signature

```java
public class SPacketSignEditorOpen extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSignEditorOpen()`
- `SPacketSignEditorOpen(BlockPos posIn)`

## Methods

- `BlockPos getSignPosition()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`