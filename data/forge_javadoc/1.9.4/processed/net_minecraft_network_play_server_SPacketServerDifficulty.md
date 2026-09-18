# SPacketServerDifficulty

## Class signature

```java
public class SPacketServerDifficulty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketServerDifficulty()`
- `public SPacketServerDifficulty( EnumDifficulty difficultyIn, boolean difficultyLockedIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean isDifficultyLocked()`
- `public EnumDifficulty getDifficulty()`