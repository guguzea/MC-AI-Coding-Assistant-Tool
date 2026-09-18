---
title: "PlayerProfileCache"
description: "public class PlayerProfileCache extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `public PlayerProfileCache(GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `public static void setOnlineMode(boolean onlineModeIn)`
- `public void addEntry(GameProfile gameProfile)`
- `public GameProfile getGameProfileForUsername(java.lang.String username)`
- `public java.lang.String[] getUsernames()`
- `public GameProfile getProfileByUUID(java.util.UUID uuid)`
- `public void load()`
- `public void save()`
