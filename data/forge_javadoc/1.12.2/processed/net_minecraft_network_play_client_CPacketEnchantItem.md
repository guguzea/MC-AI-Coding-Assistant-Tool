# CPacketEnchantItem

## Class signature

```java
public class CPacketEnchantItem extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketEnchantItem()`
- `public CPacketEnchantItem(int windowIdIn, int buttonIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getButton()`