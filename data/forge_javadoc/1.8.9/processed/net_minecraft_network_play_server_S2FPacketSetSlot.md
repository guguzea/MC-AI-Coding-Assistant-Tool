# S2FPacketSetSlot

## Class signature

```java
public class S2FPacketSetSlot extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2FPacketSetSlot()`
- `public S2FPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int func_149175_c()`
- `public int func_149173_d()`
- `public ItemStack func_149174_e()`

## Description

Passes this Packet on to the NetHandler for processing.