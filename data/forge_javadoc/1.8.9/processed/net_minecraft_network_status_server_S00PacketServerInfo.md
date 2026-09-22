# S00PacketServerInfo

**Inheritance:** java.lang.Object → net.minecraft.network.status.server.S00PacketServerInfo

## Class signature

```java
public class S00PacketServerInfo extends java.lang.Object implements Packet<INetHandlerStatusClient>
```

## Constructors

- `S00PacketServerInfo()`
- `S00PacketServerInfo(ServerStatusResponse responseIn)`

## Methods

- `ServerStatusResponse getResponse()`
- `void processPacket(INetHandlerStatusClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `static Gson GSON`