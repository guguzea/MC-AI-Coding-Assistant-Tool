# C00Handshake

**Inheritance:** java.lang.Object → net.minecraft.network.handshake.client.C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet<INetHandlerHandshakeServer>
```

## Constructors

- `C00Handshake()`
- `C00Handshake(java.lang.String p_i47613_1_, int p_i47613_2_, EnumConnectionState p_i47613_3_)`
- `C00Handshake(java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `int getProtocolVersion()`
- `EnumConnectionState getRequestedState()`
- `boolean hasFMLMarker()`
- `void processPacket(INetHandlerHandshakeServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`