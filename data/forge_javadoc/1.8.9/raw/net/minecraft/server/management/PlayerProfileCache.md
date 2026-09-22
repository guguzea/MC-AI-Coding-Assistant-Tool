---
title: "PlayerProfileCache"
description: "public class PlayerProfileCache extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(MinecraftServer server, java.io.File cacheFile)`

## Methods

- `void addEntry(GameProfile gameProfile)` — Add an entry to this cache
- `GameProfile getGameProfileForUsername(java.lang.String username)` — Get a player's GameProfile given their username.
- `GameProfile getProfileByUUID(java.util.UUID uuid)` — Get a player's GameProfile given their UUID
- `java.lang.String[] getUsernames()` — Get an array of the usernames that are cached in this cache
- `void load()` — Load the cached profiles from disk
- `void save()` — Save the cached profiles to disk

## Fields

- `static java.text.SimpleDateFormat dateFormat`
- `protected Gson gson`
