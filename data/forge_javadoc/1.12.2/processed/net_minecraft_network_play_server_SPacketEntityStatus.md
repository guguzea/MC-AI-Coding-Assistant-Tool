# SPacketEntityStatus

## Class signature

```java
public class SPacketEntityStatus extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityStatus()`
- `public SPacketEntityStatus( Entity entityIn, byte opcodeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getOpCode()`