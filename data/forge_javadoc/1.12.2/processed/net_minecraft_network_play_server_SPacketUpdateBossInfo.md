# SPacketUpdateBossInfo

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateBossInfo

## Class signature

```java
public class SPacketUpdateBossInfo extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateBossInfo()`
- `SPacketUpdateBossInfo(SPacketUpdateBossInfo.Operation operationIn, BossInfo data)`

## Methods

- `BossInfo.Color getColor()`
- `ITextComponent getName()`
- `SPacketUpdateBossInfo.Operation getOperation()`
- `BossInfo.Overlay getOverlay()`
- `float getPercent()`
- `java.util.UUID getUniqueId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `boolean shouldCreateFog()`
- `boolean shouldDarkenSky()`
- `boolean shouldPlayEndBossMusic()`
- `void writePacketData(PacketBuffer buf)`