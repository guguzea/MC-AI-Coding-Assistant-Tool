# CPacketChatMessage

## Class signature

```java
public class CPacketChatMessage extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketChatMessage()`
- `public CPacketChatMessage(java.lang.String messageIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`