# C0EPacketClickWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0EPacketClickWindow

## Class signature

```java
public class C0EPacketClickWindow extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0EPacketClickWindow()`
- `C0EPacketClickWindow(int windowId, int slotId, int usedButton, int mode, ItemStack clickedItem, short actionNumber)`

## Methods

- `short getActionNumber()`
- `ItemStack getClickedItem()`
- `int getMode()`
- `int getSlotId()`
- `int getUsedButton()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.