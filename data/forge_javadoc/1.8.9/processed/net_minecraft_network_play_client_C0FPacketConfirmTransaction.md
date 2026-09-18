# C0FPacketConfirmTransaction

## Class signature

```java
public class C0FPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0FPacketConfirmTransaction()`
- `public C0FPacketConfirmTransaction(int windowId, short uid, boolean accepted)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getUid()`

## Description

Passes this Packet on to the NetHandler for processing.