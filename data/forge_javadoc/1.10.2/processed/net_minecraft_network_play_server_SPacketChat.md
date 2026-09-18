# SPacketChat

## Class signature

```java
public class SPacketChat extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketChat()`
- `public SPacketChat( ITextComponent componentIn)`
- `public SPacketChat( ITextComponent componentIn, byte typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ITextComponent getChatComponent()`
- `public boolean isSystem()`
- `public byte getType()`