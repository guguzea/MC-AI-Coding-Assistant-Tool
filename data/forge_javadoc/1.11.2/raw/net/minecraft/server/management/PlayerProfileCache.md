---
title: "PlayerProfileCache"
description: "public class PlayerProfileCache extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `public PlayerProfileCache(com.mojang.authlib.GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `public static void setOnlineMode(boolean onlineModeIn)`
- `public void addEntry(com.mojang.authlib.GameProfile gameProfile)`
- `@Nullable public com.mojang.authlib.GameProfile getGameProfileForUsername(java.lang.String username)`
- `public java.lang.String[] getUsernames()`
- `@Nullable public com.mojang.authlib.GameProfile getProfileByUUID(java.util.UUID uuid)`
- `public void load()`
- `public void save()`
