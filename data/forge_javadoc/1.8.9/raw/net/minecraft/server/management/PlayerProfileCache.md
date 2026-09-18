---
title: "PlayerProfileCache"
description: "Add an entry to this cache"
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/PlayerProfileCache.html"
sourceType: javadoc
---

# PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `public PlayerProfileCache( MinecraftServer server, java.io.File cacheFile)`

## Methods

- `public void addEntry(GameProfile gameProfile)`
- `public GameProfile getGameProfileForUsername(java.lang.String username)`
- `public java.lang.String[] getUsernames()`
- `public GameProfile getProfileByUUID(java.util.UUID uuid)`
- `public void load()`
- `public void save()`

## Description

Add an entry to this cache
