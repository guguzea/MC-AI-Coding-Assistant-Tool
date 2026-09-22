# CPacketUpdateSign

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketUpdateSign

## Class signature

```java
public class CPacketUpdateSign extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketUpdateSign()`
- `CPacketUpdateSign(BlockPos posIn, ITextComponent [] linesIn)`

## Methods

- `java.lang.String[] getLines()`
- `BlockPos getPosition()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`