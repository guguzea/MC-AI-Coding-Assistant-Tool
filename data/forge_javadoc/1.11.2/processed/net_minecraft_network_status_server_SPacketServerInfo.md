# SPacketServerInfo

## Class signature

```java
public class SPacketServerInfo extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public SPacketServerInfo()`
- `public SPacketServerInfo( ServerStatusResponse responseIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`
- `public ServerStatusResponse getResponse()`