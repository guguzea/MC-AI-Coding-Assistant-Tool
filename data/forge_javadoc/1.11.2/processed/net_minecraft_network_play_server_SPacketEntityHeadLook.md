# SPacketEntityHeadLook

## Class signature

```java
public class SPacketEntityHeadLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityHeadLook()`
- `public SPacketEntityHeadLook( Entity entityIn, byte yawIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getYaw()`