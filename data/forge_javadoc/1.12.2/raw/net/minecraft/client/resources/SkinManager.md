---
title: "SkinManager"
description: "public class SkinManager extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/SkinManager.html"
sourceType: javadoc
---

# SkinManager

## Class signature

```java
public class SkinManager extends java.lang.Object
```

## Constructors

- `public SkinManager( TextureManager textureManagerInstance, java.io.File skinCacheDirectory, MinecraftSessionService sessionService)`

## Methods

- `public ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type textureType)`
- `public ResourceLocation loadSkin(MinecraftProfileTexture profileTexture, Type textureType, SkinManager.SkinAvailableCallback skinAvailableCallback)`
- `public void loadProfileTextures(GameProfile profile, SkinManager.SkinAvailableCallback skinAvailableCallback, boolean requireSecure)`
- `public java.util.Map<Type,MinecraftProfileTexture> loadSkinFromCache(GameProfile profile)`
