# S28PacketEffect

## Class signature

```java
public class S28PacketEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S28PacketEffect()`
- `public S28PacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public boolean isSoundServerwide()`
- `public int getSoundType()`
- `public int getSoundData()`
- `public BlockPos getSoundPos()`

## Description

Passes this Packet on to the NetHandler for processing.