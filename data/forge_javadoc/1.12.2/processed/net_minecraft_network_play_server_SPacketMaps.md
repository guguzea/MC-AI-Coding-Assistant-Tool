# SPacketMaps

## Class signature

```java
public class SPacketMaps extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketMaps()`
- `public SPacketMaps(int mapIdIn, byte mapScaleIn, boolean trackingPositionIn, java.util.Collection< MapDecoration > iconsIn, byte[] p_i46937_5_, int minXIn, int minZIn, int columnsIn, int rowsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getMapId()`
- `public void setMapdataTo( MapData mapdataIn)`