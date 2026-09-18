# SPacketPlayerListHeaderFooter

## Class signature

```java
public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerListHeaderFooter()`
- `public SPacketPlayerListHeaderFooter( ITextComponent headerIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ITextComponent getHeader()`
- `public ITextComponent getFooter()`