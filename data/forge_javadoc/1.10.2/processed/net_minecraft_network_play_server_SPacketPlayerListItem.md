# SPacketPlayerListItem

## Class signature

```java
public class SPacketPlayerListItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerListItem()`
- `public SPacketPlayerListItem( SPacketPlayerListItem.Action actionIn, EntityPlayerMP ... playersIn)`
- `public SPacketPlayerListItem( SPacketPlayerListItem.Action actionIn, java.lang.Iterable< EntityPlayerMP > playersIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< SPacketPlayerListItem.AddPlayerData > getEntries()`
- `public SPacketPlayerListItem.Action getAction()`
- `public java.lang.String toString()`