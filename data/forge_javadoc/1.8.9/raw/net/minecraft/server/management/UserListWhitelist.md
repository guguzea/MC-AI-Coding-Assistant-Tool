---
title: "UserListWhitelist"
description: "public class UserListWhitelist extends UserList<GameProfile, UserListWhitelistEntry>"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserListWhitelist.html"
sourceType: javadoc
---

# UserListWhitelist

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListWhitelistEntry> → net.minecraft.server.management.UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList<GameProfile, UserListWhitelistEntry>
```

## Methods

- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `GameProfile getBannedProfile(java.lang.String p_152706_1_)` — Gets the GameProfile for the UserListBanEntry with the specified username, if present
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)` — Gets the key value for the given object
- `boolean isWhitelisted(GameProfile profile)` — Returns true if the profile is in the whitelist.

## Fields

- `UserListWhitelist`
