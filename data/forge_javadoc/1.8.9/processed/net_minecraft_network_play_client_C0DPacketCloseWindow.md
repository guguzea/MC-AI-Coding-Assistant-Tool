# C0DPacketCloseWindow

## Class signature

```java
public class C0DPacketCloseWindow extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0DPacketCloseWindow()`
- `public C0DPacketCloseWindow(int windowId)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`

## Description

Passes this Packet on to the NetHandler for processing.