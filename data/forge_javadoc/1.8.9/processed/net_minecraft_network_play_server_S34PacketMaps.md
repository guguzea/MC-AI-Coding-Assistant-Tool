# S34PacketMaps

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S34PacketMaps

## Class signature

```java
public class S34PacketMaps extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S34PacketMaps()`
- `S34PacketMaps(int mapIdIn, byte scale, java.util.Collection<Vec4b> visiblePlayers, byte[] colors, int minX, int minY, int maxX, int maxY)`

## Methods

- `int getMapId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setMapdataTo(MapData mapdataIn)` — Sets new MapData from the packet to given MapData param
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.