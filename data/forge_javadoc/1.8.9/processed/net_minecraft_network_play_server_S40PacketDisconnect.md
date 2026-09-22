# S40PacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S40PacketDisconnect

## Class signature

```java
public class S40PacketDisconnect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S40PacketDisconnect()`
- `S40PacketDisconnect(IChatComponent reasonIn)`

## Methods

- `IChatComponent getReason()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.