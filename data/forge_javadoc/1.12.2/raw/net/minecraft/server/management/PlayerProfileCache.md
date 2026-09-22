---
title: "PlayerProfileCache"
description: "public class PlayerProfileCache extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `void addEntry(GameProfile gameProfile)`
- `GameProfile getGameProfileForUsername(java.lang.String username)`
- `GameProfile getProfileByUUID(java.util.UUID uuid)`
- `java.lang.String[] getUsernames()`
- `void load()`
- `void save()`
- `static void setOnlineMode(boolean onlineModeIn)`

## Fields

- `static java.text.SimpleDateFormat DATE_FORMAT`
- `protected Gson gson`
