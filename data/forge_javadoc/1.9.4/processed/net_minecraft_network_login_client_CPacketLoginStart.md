# CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public CPacketLoginStart()`
- `public CPacketLoginStart(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public com.mojang.authlib.GameProfile getProfile()`