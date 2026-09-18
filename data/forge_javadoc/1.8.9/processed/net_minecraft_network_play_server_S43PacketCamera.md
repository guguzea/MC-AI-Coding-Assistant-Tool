# S43PacketCamera

## Class signature

```java
public class S43PacketCamera extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S43PacketCamera()`
- `public S43PacketCamera( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`

## Description

Passes this Packet on to the NetHandler for processing.