# S02PacketChat

## Class signature

```java
public class S02PacketChat extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S02PacketChat()`
- `public S02PacketChat( IChatComponent component)`
- `public S02PacketChat( IChatComponent message, byte typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IChatComponent getChatComponent()`
- `public boolean isChat()`
- `public byte getType()`

## Description

Returns the id of the area to display the text, 2 for above the action bar, anything else currently for the chat window