---
title: "UserListBans"
description: "public class UserListBans extends UserList<GameProfile, UserListBansEntry>"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/UserListBans.html"
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
- `GameProfile getBannedProfile(java.lang.String username)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `boolean isBanned(GameProfile profile)`

## Fields

- `UserListBans`
