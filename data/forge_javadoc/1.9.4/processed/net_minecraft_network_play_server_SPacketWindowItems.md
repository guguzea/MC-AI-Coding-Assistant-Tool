# SPacketWindowItems

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWindowItems()`
- `SPacketWindowItems(int windowIdIn, java.util.List<ItemStack> stacks)`

## Methods

- `ItemStack [] getItemStacks()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`