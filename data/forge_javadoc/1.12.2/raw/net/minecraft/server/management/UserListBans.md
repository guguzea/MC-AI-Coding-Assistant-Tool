---
title: "UserListBans"
description: "public class UserListBans extends UserList <GameProfile, UserListBansEntry >"
package: "net/minecraft/server/management"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/UserListBans.html"
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
- `public GameProfile getBannedProfile(java.lang.String username)`
