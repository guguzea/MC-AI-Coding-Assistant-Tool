# C0EPacketClickWindow

## Class signature

```java
public class C0EPacketClickWindow extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0EPacketClickWindow()`
- `public C0EPacketClickWindow(int windowId, int slotId, int usedButton, int mode, ItemStack clickedItem, short actionNumber)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getSlotId()`
- `public int getUsedButton()`
- `public short getActionNumber()`
- `public ItemStack getClickedItem()`
- `public int getMode()`

## Description

Passes this Packet on to the NetHandler for processing.