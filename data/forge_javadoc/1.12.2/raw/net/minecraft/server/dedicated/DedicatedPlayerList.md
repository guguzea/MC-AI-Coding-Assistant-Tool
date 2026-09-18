---
title: "DedicatedPlayerList"
description: "public class DedicatedPlayerList extends PlayerList"
package: "net/minecraft/server/dedicated"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/dedicated/DedicatedPlayerList.html"
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
- `public void addOp(GameProfile profile)`
- `public void removeOp(GameProfile profile)`
- `public void removePlayerFromWhitelist(GameProfile profile)`
- `public void addWhitelistedPlayer(GameProfile profile)`
- `public void reloadWhitelist()`
- `public boolean canJoin(GameProfile profile)`
- `public DedicatedServer getServerInstance()`
- `public boolean bypassesPlayerLimit(GameProfile profile)`
