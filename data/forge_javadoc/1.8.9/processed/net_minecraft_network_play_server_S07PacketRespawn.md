# S07PacketRespawn

## Class signature

```java
public class S07PacketRespawn extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S07PacketRespawn()`
- `public S07PacketRespawn(int dimensionIDIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, WorldSettings.GameType gameTypeIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getDimensionID()`
- `public EnumDifficulty getDifficulty()`
- `public WorldSettings.GameType getGameType()`
- `public WorldType getWorldType()`

## Description

Passes this Packet on to the NetHandler for processing.