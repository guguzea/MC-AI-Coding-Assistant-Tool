# S01PacketPong

**Inheritance:** java.lang.Object → net.minecraft.network.status.server.S01PacketPong

## Class signature

```java
public class S01PacketPong extends java.lang.Object implements Packet<INetHandlerStatusClient>
```

## Constructors

- `S01PacketPong()`
- `S01PacketPong(long time)`

## Methods

- `void processPacket(INetHandlerStatusClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.