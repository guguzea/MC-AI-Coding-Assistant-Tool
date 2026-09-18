# CPacketEntityAction

## Class signature

```java
public class CPacketEntityAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketEntityAction()`
- `public CPacketEntityAction( Entity entityIn, CPacketEntityAction.Action actionIn)`
- `public CPacketEntityAction( Entity entityIn, CPacketEntityAction.Action actionIn, int auxDataIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketEntityAction.Action getAction()`
- `public int getAuxData()`