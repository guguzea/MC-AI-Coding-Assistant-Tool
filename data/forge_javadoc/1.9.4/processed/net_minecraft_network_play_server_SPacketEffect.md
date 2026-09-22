# SPacketEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEffect

## Class signature

```java
public class SPacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEffect()`
- `SPacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `int getSoundData()`
- `BlockPos getSoundPos()`
- `int getSoundType()`
- `boolean isSoundServerwide()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`