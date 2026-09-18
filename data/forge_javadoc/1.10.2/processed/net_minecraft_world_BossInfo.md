# BossInfo

## Class signature

```java
public abstract class BossInfo extends java.lang.Object
```

## Constructors

- `public BossInfo(java.util.UUID uniqueIdIn, ITextComponent nameIn, BossInfo.Color colorIn, BossInfo.Overlay overlayIn)`

## Methods

- `public java.util.UUID getUniqueId()`
- `public ITextComponent getName()`
- `public void setName( ITextComponent nameIn)`
- `public float getPercent()`
- `public void setPercent(float percentIn)`
- `public BossInfo.Color getColor()`
- `public void setColor( BossInfo.Color colorIn)`
- `public BossInfo.Overlay getOverlay()`
- `public void setOverlay( BossInfo.Overlay overlayIn)`
- `public boolean shouldDarkenSky()`
- `public BossInfo setDarkenSky(boolean darkenSkyIn)`
- `public boolean shouldPlayEndBossMusic()`
- `public BossInfo setPlayEndBossMusic(boolean playEndBossMusicIn)`
- `public BossInfo setCreateFog(boolean createFogIn)`
- `public boolean shouldCreateFog()`