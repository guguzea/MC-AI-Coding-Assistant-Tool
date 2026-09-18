# S00PacketDisconnect

## Class signature

```java
public class S00PacketDisconnect extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S00PacketDisconnect()`
- `public S00PacketDisconnect( IChatComponent reasonIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public IChatComponent func_149603_c()`

## Description

Passes this Packet on to the NetHandler for processing.