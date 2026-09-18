# C01PacketChatMessage

## Class signature

```java
public class C01PacketChatMessage extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C01PacketChatMessage()`
- `public C01PacketChatMessage(java.lang.String messageIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`

## Description

Passes this Packet on to the NetHandler for processing.