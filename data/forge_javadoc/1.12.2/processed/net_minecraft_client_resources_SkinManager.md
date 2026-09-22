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
- `ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type textureType)`
- `ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type textureType, SkinManager.SkinAvailableCallback skinAvailableCallback)`
- `java.util.Map<Type, MinecraftProfileTexture> loadSkinFromCache(GameProfile profile)`