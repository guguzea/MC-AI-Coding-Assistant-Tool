# S2EPacketCloseWindow

## Class signature

```java
public class S2EPacketCloseWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2EPacketCloseWindow()`
- `public S2EPacketCloseWindow(int windowIdIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`

## Description

Passes this Packet on to the NetHandler for processing.