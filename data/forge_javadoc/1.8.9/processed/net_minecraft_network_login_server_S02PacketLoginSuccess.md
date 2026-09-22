# S02PacketLoginSuccess

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.S02PacketLoginSuccess

## Class signature

```java
public class S02PacketLoginSuccess extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `S02PacketLoginSuccess()`
- `S02PacketLoginSuccess(GameProfile profileIn)`

## Methods

- `GameProfile getProfile()`
- `void processPacket(INetHandlerLoginClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.