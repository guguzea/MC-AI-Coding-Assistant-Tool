# SPacketSetSlot

## Class signature

```java
public class SPacketSetSlot extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetSlot()`
- `public SPacketSetSlot(int windowIdIn, int slotIn, @Nullable ItemStack itemIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getSlot()`
- `@Nullable public ItemStack getStack()`