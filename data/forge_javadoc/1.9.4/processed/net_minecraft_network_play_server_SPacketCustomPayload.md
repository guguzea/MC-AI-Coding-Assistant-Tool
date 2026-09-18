# SPacketCustomPayload

## Class signature

```java
public class SPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCustomPayload()`
- `public SPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`