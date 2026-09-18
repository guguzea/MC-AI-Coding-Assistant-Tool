# S00PacketServerInfo

## Class signature

```java
public class S00PacketServerInfo extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public S00PacketServerInfo()`
- `public S00PacketServerInfo( ServerStatusResponse responseIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`
- `public ServerStatusResponse getResponse()`

## Description

Passes this Packet on to the NetHandler for processing.