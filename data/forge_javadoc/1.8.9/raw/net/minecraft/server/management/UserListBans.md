---
title: "UserListBans"
description: "public class UserListBans extends UserList<GameProfile, UserListBansEntry>"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserListBans.html"
sourceType: javadoc
---

# UserListBans

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListBansEntry> → net.minecraft.server.management.UserListBans

## Class signature

```java
public class UserListBans extends UserList<GameProfile, UserListBansEntry>
```

## Methods

- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)` — Gets the key value for the given object
- `boolean isBanned(GameProfile profile)`
- `GameProfile isUsernameBanned(java.lang.String username)`

## Fields

- `UserListBans`
