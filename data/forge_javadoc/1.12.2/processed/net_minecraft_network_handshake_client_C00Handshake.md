# C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet < INetHandlerHandshakeServer >
```

## Constructors

- `public C00Handshake()`
- `public C00Handshake(java.lang.String p_i47613_1_, int p_i47613_2_, EnumConnectionState p_i47613_3_)`
- `public C00Handshake(java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerHandshakeServer handler)`
- `public EnumConnectionState getRequestedState()`
- `public int getProtocolVersion()`
- `public boolean hasFMLMarker()`