---
title: "DedicatedPlayerList"
description: "public class DedicatedPlayerList extends PlayerList"
package: "net/minecraft/server/dedicated"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/server/dedicated/DedicatedPlayerList.html"
sourceType: javadoc
---

# DedicatedPlayerList

## Class signature

```java
public class DedicatedPlayerList extends PlayerList
```

## Constructors

- `public DedicatedPlayerList( DedicatedServer server)`

## Methods

- `public void setWhiteListEnabled(boolean whitelistEnabled)`
- `public void addOp(com.mojang.authlib.GameProfile profile)`
- `public void removeOp(com.mojang.authlib.GameProfile profile)`
- `public void removePlayerFromWhitelist(com.mojang.authlib.GameProfile profile)`
- `public void addWhitelistedPlayer(com.mojang.authlib.GameProfile profile)`
- `public void reloadWhitelist()`
- `public boolean canJoin(com.mojang.authlib.GameProfile profile)`
- `public DedicatedServer getServerInstance()`
- `public boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
