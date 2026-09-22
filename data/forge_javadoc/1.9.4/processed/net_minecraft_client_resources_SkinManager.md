# SkinManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.SkinManager

## Class signature

```java
public class SkinManager extends java.lang.Object
```

## Constructors

- `SkinManager(TextureManager textureManagerInstance, java.io.File skinCacheDirectory, com.mojang.authlib.minecraft.MinecraftSessionService sessionService)`

## Methods

- `void loadProfileTextures(com.mojang.authlib.GameProfile profile, SkinManager.SkinAvailableCallback skinAvailableCallback, boolean requireSecure)`
- `ResourceLocation loadSkin(com.mojang.authlib.minecraft.MinecraftProfileTexture profileTexture, com.mojang.authlib.minecraft.MinecraftProfileTexture.Type textureType)`
- `ResourceLocation loadSkin(com.mojang.authlib.minecraft.MinecraftProfileTexture profileTexture, com.mojang.authlib.minecraft.MinecraftProfileTexture.Type textureType, SkinManager.SkinAvailableCallback skinAvailableCallback)`
- `java.util.Map<com.mojang.authlib.minecraft.MinecraftProfileTexture.Type, com.mojang.authlib.minecraft.MinecraftProfileTexture> loadSkinFromCache(com.mojang.authlib.GameProfile profile)`