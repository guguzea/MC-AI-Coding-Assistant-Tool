# SPacketRespawn

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRespawn

## Class signature

```java
public class SPacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRespawn()`
- `SPacketRespawn(int dimensionIdIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, WorldSettings.GameType gameModeIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimensionID()`
- `WorldSettings.GameType getGameType()`
- `WorldType getWorldType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`