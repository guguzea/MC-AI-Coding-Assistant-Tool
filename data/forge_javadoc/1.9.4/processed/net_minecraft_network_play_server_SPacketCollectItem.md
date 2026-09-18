# SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCollectItem()`
- `public SPacketCollectItem(int collectedItemEntityIdIn, int entityIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getCollectedItemEntityID()`
- `public int getEntityID()`