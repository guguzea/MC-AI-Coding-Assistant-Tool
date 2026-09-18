# SPacketOpenWindow

## Class signature

```java
public class SPacketOpenWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketOpenWindow()`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn)`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn)`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn, int entityIdIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public java.lang.String getGuiId()`
- `public ITextComponent getWindowTitle()`
- `public int getSlotCount()`
- `public int getEntityId()`
- `public boolean hasSlots()`