# SPacketCollectItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCollectItem()`
- `SPacketCollectItem(int collectedItemEntityIdIn, int entityIdIn)`

## Methods

- `int getCollectedItemEntityID()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`