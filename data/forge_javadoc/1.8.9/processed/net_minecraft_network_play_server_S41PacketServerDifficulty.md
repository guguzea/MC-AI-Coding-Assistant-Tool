# S41PacketServerDifficulty

## Class signature

```java
public class S41PacketServerDifficulty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S41PacketServerDifficulty()`
- `public S41PacketServerDifficulty( EnumDifficulty difficultyIn, boolean lockedIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean isDifficultyLocked()`
- `public EnumDifficulty getDifficulty()`

## Description

Passes this Packet on to the NetHandler for processing.