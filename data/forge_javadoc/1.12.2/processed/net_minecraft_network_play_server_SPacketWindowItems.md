# SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWindowItems()`
- `public SPacketWindowItems(int p_i47317_1_, NonNullList < ItemStack > p_i47317_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getWindowId()`
- `public java.util.List< ItemStack > getItemStacks()`