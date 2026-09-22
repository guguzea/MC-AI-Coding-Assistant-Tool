# CPacketPlayerTryUseItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerTryUseItem

## Class signature

```java
public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerTryUseItem()`
- `CPacketPlayerTryUseItem(EnumHand handIn)`

## Methods

- `EnumHand getHand()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`