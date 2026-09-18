# SPacketEntityProperties

## Class signature

```java
public class SPacketEntityProperties extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityProperties()`
- `public SPacketEntityProperties(int entityIdIn, java.util.Collection< IAttributeInstance > instances)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public java.util.List< SPacketEntityProperties.Snapshot > getSnapshots()`