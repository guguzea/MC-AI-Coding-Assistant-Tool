# SPacketCamera

## Class signature

```java
public class SPacketCamera extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCamera()`
- `public SPacketCamera( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`