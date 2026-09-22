---
title: "SkinManager"
description: "public class SkinManager extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/SkinManager.html"
sourceType: javadoc
---

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
