# SkinManager

## Class signature

```java
public class SkinManager extends java.lang.Object
```

## Constructors

- `public SkinManager( TextureManager textureManagerInstance, java.io.File skinCacheDirectory, MinecraftSessionService sessionService)`

## Methods

- `public ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type p_152792_2_)`
- `public ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type p_152789_2_, SkinManager.SkinAvailableCallback skinAvailableCallback)`
- `public void loadProfileTextures(GameProfile profile, SkinManager.SkinAvailableCallback skinAvailableCallback, boolean requireSecure)`
- `public java.util.Map<Type,MinecraftProfileTexture> loadSkinFromCache(GameProfile profile)`

## Description

Used in the Skull renderer to fetch a skin.