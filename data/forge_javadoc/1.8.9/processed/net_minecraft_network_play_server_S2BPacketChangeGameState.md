# S2BPacketChangeGameState

## Class signature

```java
public class S2BPacketChangeGameState extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2BPacketChangeGameState()`
- `public S2BPacketChangeGameState(int stateIn, float p_i45194_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getGameState()`
- `public float func_149137_d()`

## Description

Passes this Packet on to the NetHandler for processing.