# CPacketConfirmTransaction

## Class signature

```java
public class CPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketConfirmTransaction()`
- `public CPacketConfirmTransaction(int windowIdIn, short uidIn, boolean acceptedIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getUid()`