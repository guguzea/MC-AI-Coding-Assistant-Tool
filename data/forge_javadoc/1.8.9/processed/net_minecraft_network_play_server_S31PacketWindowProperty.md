# S31PacketWindowProperty

## Class signature

```java
public class S31PacketWindowProperty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S31PacketWindowProperty()`
- `public S31PacketWindowProperty(int windowIdIn, int varIndexIn, int varValueIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getVarIndex()`
- `public int getVarValue()`

## Description

Passes this Packet on to the NetHandler for processing.