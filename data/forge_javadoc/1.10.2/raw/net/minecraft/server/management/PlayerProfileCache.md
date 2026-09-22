---
title: "PlayerProfileCache"
description: "public class PlayerProfileCache extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(com.mojang.authlib.GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `void addEntry(com.mojang.authlib.GameProfile gameProfile)`
- `com.mojang.authlib.GameProfile getGameProfileForUsername(java.lang.String username)`
- `com.mojang.authlib.GameProfile getProfileByUUID(java.util.UUID uuid)`
- `java.lang.String[] getUsernames()`
- `void load()`
- `void save()`
- `static void setOnlineMode(boolean onlineModeIn)`

## Fields

- `static java.text.SimpleDateFormat DATE_FORMAT`
- `protected com.google.gson.Gson gson`
