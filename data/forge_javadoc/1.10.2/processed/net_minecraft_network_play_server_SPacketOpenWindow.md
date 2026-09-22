# SPacketOpenWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketOpenWindow

## Class signature

```java
public class SPacketOpenWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketOpenWindow()`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn)`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn)`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn, int entityIdIn)`

## Methods

- `int getEntityId()`
- `java.lang.String getGuiId()`
- `int getSlotCount()`
- `int getWindowId()`
- `ITextComponent getWindowTitle()`
- `boolean hasSlots()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`