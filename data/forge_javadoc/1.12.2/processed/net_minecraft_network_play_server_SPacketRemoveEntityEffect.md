# SPacketRemoveEntityEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRemoveEntityEffect

## Class signature

```java
public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRemoveEntityEffect()`
- `SPacketRemoveEntityEffect(int entityIdIn, Potion potionIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `Potion getPotion()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`