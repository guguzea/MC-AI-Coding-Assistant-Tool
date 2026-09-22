# SPacketSetSlot

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSetSlot

## Class signature

```java
public class SPacketSetSlot extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSetSlot()`
- `SPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `int getSlot()`
- `ItemStack getStack()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`