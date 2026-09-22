# SPacketJoinGame

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketJoinGame

## Class signature

```java
public class SPacketJoinGame extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketJoinGame()`
- `SPacketJoinGame(int playerIdIn, WorldSettings.GameType gameTypeIn, boolean hardcoreModeIn, int dimensionIn, EnumDifficulty difficultyIn, int maxPlayersIn, WorldType worldTypeIn, boolean reducedDebugInfoIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimension()`
- `WorldSettings.GameType getGameType()`
- `int getMaxPlayers()`
- `int getPlayerId()`
- `WorldType getWorldType()`
- `boolean isHardcoreMode()`
- `boolean isReducedDebugInfo()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`