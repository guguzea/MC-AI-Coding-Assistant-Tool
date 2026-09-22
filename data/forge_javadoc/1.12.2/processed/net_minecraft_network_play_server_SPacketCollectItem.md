# SPacketCollectItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCollectItem()`
- `SPacketCollectItem(int p_i47316_1_, int p_i47316_2_, int p_i47316_3_)`

## Methods

- `int getAmount()`
- `int getCollectedItemEntityID()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`