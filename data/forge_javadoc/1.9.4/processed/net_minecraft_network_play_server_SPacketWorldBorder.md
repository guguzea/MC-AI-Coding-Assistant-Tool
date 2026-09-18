# SPacketWorldBorder

## Class signature

```java
public class SPacketWorldBorder extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWorldBorder()`
- `public SPacketWorldBorder( WorldBorder border, SPacketWorldBorder.Action actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public void apply( WorldBorder border)`