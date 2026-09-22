# BossInfo

**Inheritance:** java.lang.Object → net.minecraft.world.BossInfo

## Class signature

```java
public abstract class BossInfo extends java.lang.Object
```

## Constructors

- `BossInfo(java.util.UUID uniqueIdIn, ITextComponent nameIn, BossInfo.Color colorIn, BossInfo.Overlay overlayIn)`

## Methods

- `BossInfo.Color getColor()`
- `ITextComponent getName()`
- `BossInfo.Overlay getOverlay()`
- `float getPercent()`
- `java.util.UUID getUniqueId()`
- `void setColor(BossInfo.Color colorIn)`
- `BossInfo setCreateFog(boolean createFogIn)`
- `BossInfo setDarkenSky(boolean darkenSkyIn)`
- `void setName(ITextComponent nameIn)`
- `void setOverlay(BossInfo.Overlay overlayIn)`
- `void setPercent(float percentIn)`
- `BossInfo setPlayEndBossMusic(boolean playEndBossMusicIn)`
- `boolean shouldCreateFog()`
- `boolean shouldDarkenSky()`
- `boolean shouldPlayEndBossMusic()`

## Fields

- `protected BossInfo.Color color`
- `protected boolean createFog`
- `protected boolean darkenSky`
- `protected ITextComponent name`
- `protected BossInfo.Overlay overlay`
- `protected float percent`
- `protected boolean playEndBossMusic`