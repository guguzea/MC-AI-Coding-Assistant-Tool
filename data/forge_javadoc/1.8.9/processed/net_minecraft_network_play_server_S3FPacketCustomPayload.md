# S3FPacketCustomPayload

## Class signature

```java
public class S3FPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S3FPacketCustomPayload()`
- `public S3FPacketCustomPayload(java.lang.String channelName, PacketBuffer dataIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`

## Description

Passes this Packet on to the NetHandler for processing.