---
title: "DedicatedPlayerList"
description: "Either does nothing, or calls readWhiteList."
package: "net/minecraft/server/dedicated"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/dedicated/DedicatedPlayerList.html"
sourceType: javadoc
---

# DedicatedPlayerList

## Class signature

```java
public class DedicatedPlayerList extends ServerConfigurationManager
```

## Constructors

- `public DedicatedPlayerList( DedicatedServer server)`

## Methods

- `public void setWhiteListEnabled(boolean whitelistEnabled)`
- `public void addOp(GameProfile profile)`
- `public void removeOp(GameProfile profile)`
- `public void removePlayerFromWhitelist(GameProfile profile)`
- `public void addWhitelistedPlayer(GameProfile profile)`
- `public void loadWhiteList()`
- `public boolean canJoin(GameProfile profile)`
- `public DedicatedServer getServerInstance()`
- `public boolean func_183023_f(GameProfile p_183023_1_)`

## Description

Either does nothing, or calls readWhiteList.
