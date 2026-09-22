# S48PacketResourcePackSend

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S48PacketResourcePackSend

## Class signature

```java
public class S48PacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S48PacketResourcePackSend()`
- `S48PacketResourcePackSend(java.lang.String url, java.lang.String hash)`

## Methods

- `java.lang.String getHash()`
- `java.lang.String getURL()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.