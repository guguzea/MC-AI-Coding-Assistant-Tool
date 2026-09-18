# AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Constructors

- `public AbstractClientPlayer( World worldIn, GameProfile playerProfile)`

## Methods

- `public boolean isSpectator()`
- `public boolean hasPlayerInfo()`
- `protected NetworkPlayerInfo getPlayerInfo()`
- `public boolean hasSkin()`
- `public ResourceLocation getLocationSkin()`
- `public ResourceLocation getLocationCape()`
- `public static ThreadDownloadImageData getDownloadImageSkin( ResourceLocation resourceLocationIn, java.lang.String username)`
- `public static ResourceLocation getLocationSkin(java.lang.String username)`
- `public java.lang.String getSkinType()`
- `public float getFovModifier()`

## Description

Returns true if the player instance has an associated skin.