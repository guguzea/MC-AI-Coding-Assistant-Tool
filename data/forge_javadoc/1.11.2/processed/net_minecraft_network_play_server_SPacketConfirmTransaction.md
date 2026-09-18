# SPacketConfirmTransaction

## Class signature

```java
public class SPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketConfirmTransaction()`
- `public SPacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean acceptedIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getActionNumber()`
- `public boolean wasAccepted()`