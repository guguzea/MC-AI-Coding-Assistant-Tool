# SPacketEntityAttach

## Class signature

```java
public class SPacketEntityAttach extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityAttach()`
- `public SPacketEntityAttach( Entity entityIn, @Nullable Entity vehicleIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public int getVehicleEntityId()`