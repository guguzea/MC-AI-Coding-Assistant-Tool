# CPacketPlayerTryUseItem

## Class signature

```java
public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerTryUseItem()`
- `public CPacketPlayerTryUseItem( EnumHand handIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public EnumHand getHand()`