---
title: "SkinManager"
description: "public class SkinManager extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/SkinManager.html"
sourceType: javadoc
---

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
