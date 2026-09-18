# S40PacketDisconnect

## Class signature

```java
public class S40PacketDisconnect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S40PacketDisconnect()`
- `public S40PacketDisconnect( IChatComponent reasonIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IChatComponent getReason()`

## Description

Passes this Packet on to the NetHandler for processing.