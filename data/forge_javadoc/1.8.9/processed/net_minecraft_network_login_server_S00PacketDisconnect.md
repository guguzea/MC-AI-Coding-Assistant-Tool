# S00PacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.S00PacketDisconnect

## Class signature

```java
public class S00PacketDisconnect extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `S00PacketDisconnect()`
- `S00PacketDisconnect(IChatComponent reasonIn)`

## Methods

- `IChatComponent func_149603_c()`
- `void processPacket(INetHandlerLoginClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.