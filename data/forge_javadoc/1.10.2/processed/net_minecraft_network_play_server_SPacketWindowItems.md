# SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWindowItems()`
- `public SPacketWindowItems(int windowIdIn, java.util.List< ItemStack > stacks)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getWindowId()`
- `public ItemStack [] getItemStacks()`