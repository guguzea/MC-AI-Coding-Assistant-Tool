# C10PacketCreativeInventoryAction

## Class signature

```java
public class C10PacketCreativeInventoryAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C10PacketCreativeInventoryAction()`
- `public C10PacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getSlotId()`
- `public ItemStack getStack()`

## Description

Passes this Packet on to the NetHandler for processing.