---
title: "UserListBans"
description: "public class UserListBans extends UserList<com.mojang.authlib.GameProfile, UserListBansEntry>"
package: "net/minecraft/server/management"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/UserListBans.html"
sourceType: javadoc
---

# UserListBans

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<com.mojang.authlib.GameProfile, UserListBansEntry> → net.minecraft.server.management.UserListBans

## Class signature

```java
public class UserListBans extends UserList<com.mojang.authlib.GameProfile, UserListBansEntry>
```

## Methods

- `protected UserListEntry<com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `com.mojang.authlib.GameProfile getBannedProfile(java.lang.String username)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `boolean isBanned(com.mojang.authlib.GameProfile profile)`

## Fields

- `UserListBans`
