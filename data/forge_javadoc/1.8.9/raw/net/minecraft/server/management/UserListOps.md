---
title: "UserListOps"
description: "Gets the GameProfile of based on the provided username."
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserListOps.html"
sourceType: javadoc
---

# UserListOps

## Class signature

```java
public class UserListOps extends UserList <GameProfile, UserListOpsEntry >
```

## Constructors

- `public UserListOps(java.io.File saveFile)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public boolean func_183026_b(GameProfile p_183026_1_)`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile getGameProfileFromName(java.lang.String username)`

## Description

Gets the GameProfile of based on the provided username.
