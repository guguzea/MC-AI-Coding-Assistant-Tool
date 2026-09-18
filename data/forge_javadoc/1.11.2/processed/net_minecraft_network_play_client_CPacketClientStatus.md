# CPacketClientStatus

## Class signature

```java
public class CPacketClientStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketClientStatus()`
- `public CPacketClientStatus( CPacketClientStatus.State p_i46886_1_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketClientStatus.State getStatus()`