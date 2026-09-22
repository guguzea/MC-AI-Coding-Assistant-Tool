---
title: "UserListWhitelist"
description: "public class UserListWhitelist extends UserList<com.mojang.authlib.GameProfile, UserListWhitelistEntry>"
package: "net/minecraft/server/management"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/server/management/UserListWhitelist.html"
sourceType: javadoc
---

# UserListWhitelist

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<com.mojang.authlib.GameProfile, UserListWhitelistEntry> → net.minecraft.server.management.UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList<com.mojang.authlib.GameProfile, UserListWhitelistEntry>
```

## Methods

- `protected UserListEntry<com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `com.mojang.authlib.GameProfile getByName(java.lang.String profileName)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `boolean isWhitelisted(com.mojang.authlib.GameProfile profile)`

## Fields

- `UserListWhitelist`
