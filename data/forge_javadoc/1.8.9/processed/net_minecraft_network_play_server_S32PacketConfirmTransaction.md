# S32PacketConfirmTransaction

## Class signature

```java
public class S32PacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S32PacketConfirmTransaction()`
- `public S32PacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean p_i45182_3_)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getActionNumber()`
- `public boolean func_148888_e()`

## Description

Passes this Packet on to the NetHandler for processing.