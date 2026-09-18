# CPacketCustomPayload

## Class signature

```java
public class CPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketCustomPayload()`
- `public CPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`