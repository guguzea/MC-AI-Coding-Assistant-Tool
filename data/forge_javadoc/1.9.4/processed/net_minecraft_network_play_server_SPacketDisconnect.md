# SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketDisconnect()`
- `public SPacketDisconnect( ITextComponent messageIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ITextComponent getReason()`