# SPacketLoginSuccess

## Class signature

```java
public class SPacketLoginSuccess extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketLoginSuccess()`
- `public SPacketLoginSuccess(GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public GameProfile getProfile()`