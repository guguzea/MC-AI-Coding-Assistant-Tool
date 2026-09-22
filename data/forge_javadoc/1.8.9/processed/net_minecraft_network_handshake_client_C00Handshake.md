# C00Handshake

**Inheritance:** java.lang.Object → net.minecraft.network.handshake.client.C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet<INetHandlerHandshakeServer>
```

## Constructors

- `C00Handshake()`
- `C00Handshake(int version, java.lang.String ip, int port, EnumConnectionState requestedState)`
- `C00Handshake(int protocol, java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `int getProtocolVersion()`
- `EnumConnectionState getRequestedState()`
- `boolean hasFMLMarker()`
- `void processPacket(INetHandlerHandshakeServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.