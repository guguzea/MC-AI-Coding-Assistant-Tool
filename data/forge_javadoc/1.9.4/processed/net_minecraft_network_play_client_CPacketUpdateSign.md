# CPacketUpdateSign

## Class signature

```java
public class CPacketUpdateSign extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketUpdateSign()`
- `public CPacketUpdateSign( BlockPos posIn, ITextComponent [] linesIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public java.lang.String[] getLines()`