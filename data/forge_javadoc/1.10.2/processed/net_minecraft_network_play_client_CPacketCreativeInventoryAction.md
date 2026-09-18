# CPacketCreativeInventoryAction

## Class signature

```java
public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketCreativeInventoryAction()`
- `public CPacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getSlotId()`
- `public ItemStack getStack()`