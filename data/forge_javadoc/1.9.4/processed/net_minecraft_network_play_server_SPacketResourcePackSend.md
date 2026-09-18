# SPacketResourcePackSend

## Class signature

```java
public class SPacketResourcePackSend extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketResourcePackSend()`
- `public SPacketResourcePackSend(java.lang.String urlIn, java.lang.String hashIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getURL()`
- `public java.lang.String getHash()`