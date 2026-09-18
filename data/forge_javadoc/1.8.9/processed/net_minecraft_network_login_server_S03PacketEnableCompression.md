# S03PacketEnableCompression

## Class signature

```java
public class S03PacketEnableCompression extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S03PacketEnableCompression()`
- `public S03PacketEnableCompression(int compressionTresholdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public int getCompressionTreshold()`

## Description

Passes this Packet on to the NetHandler for processing.