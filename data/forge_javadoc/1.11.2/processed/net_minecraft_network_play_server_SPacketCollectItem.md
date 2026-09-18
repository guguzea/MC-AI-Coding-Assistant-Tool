# SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCollectItem()`
- `public SPacketCollectItem(int p_i47316_1_, int p_i47316_2_, int p_i47316_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getCollectedItemEntityID()`
- `public int getEntityID()`
- `public int getAmount()`