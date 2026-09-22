# SkinManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.SkinManager

## Class signature

```java
public class SkinManager extends java.lang.Object
```

## Constructors

- `SkinManager(TextureManager textureManagerInstance, java.io.File skinCacheDirectory, MinecraftSessionService sessionService)`

## Methods

- `void loadProfileTextures(GameProfile profile, SkinManager.SkinAvailableCallback skinAvailableCallback, boolean requireSecure)`
- `ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type p_152792_2_)` — Used in the Skull renderer to fetch a skin.
- `ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type p_152789_2_, SkinManager.SkinAvailableCallback skinAvailableCallback)` — May download the skin if its not in the cache, can be passed a SkinManager#SkinAvailableCallback for handling
- `java.util.Map<Type, MinecraftProfileTexture> loadSkinFromCache(GameProfile profile)`