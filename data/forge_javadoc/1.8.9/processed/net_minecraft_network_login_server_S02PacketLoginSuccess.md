# S02PacketLoginSuccess

## Class signature

```java
public class S02PacketLoginSuccess extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S02PacketLoginSuccess()`
- `public S02PacketLoginSuccess(GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public GameProfile getProfile()`

## Description

Passes this Packet on to the NetHandler for processing.