# AbstractClientPlayer

## Class signature

```java
public abstract class AbstractClientPlayer extends EntityPlayer
```

## Constructors

- `public AbstractClientPlayer( World worldIn, com.mojang.authlib.GameProfile playerProfile)`

## Methods

- `public boolean isSpectator()`
- `public boolean isCreative()`
- `public boolean hasPlayerInfo()`
- `@Nullable protected NetworkPlayerInfo getPlayerInfo()`
- `public boolean hasSkin()`
- `public ResourceLocation getLocationSkin()`
- `@Nullable public ResourceLocation getLocationCape()`
- `public boolean isPlayerInfoSet()`
- `@Nullable public ResourceLocation getLocationElytra()`
- `public static ThreadDownloadImageData getDownloadImageSkin( ResourceLocation resourceLocationIn, java.lang.String username)`
- `public static ResourceLocation getLocationSkin(java.lang.String username)`
- `public java.lang.String getSkinType()`
- `public float getFovModifier()`