---
title: "UserListBans"
description: "Gets the key value for the given object"
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserListBans.html"
sourceType: javadoc
---

# UserListBans

## Class signature

```java
public class UserListBans extends UserList <GameProfile, UserListBansEntry >
```

## Constructors

- `public UserListBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public boolean isBanned(GameProfile profile)`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile isUsernameBanned(java.lang.String username)`

## Description

Gets the key value for the given object
