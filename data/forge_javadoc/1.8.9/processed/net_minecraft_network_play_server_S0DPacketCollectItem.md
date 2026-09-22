# S0DPacketCollectItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0DPacketCollectItem

## Class signature

```java
public class S0DPacketCollectItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0DPacketCollectItem()`
- `S0DPacketCollectItem(int collectedItemEntityIdIn, int entityIdIn)`

## Methods

- `int getCollectedItemEntityID()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.