---
title: "UserListOpsEntry"
description: "public class UserListOpsEntry extends UserListEntry<com.mojang.authlib.GameProfile>"
package: "net/minecraft/server/management"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/server/management/UserListOpsEntry.html"
sourceType: javadoc
---

# UserListOpsEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<com.mojang.authlib.GameProfile> → net.minecraft.server.management.UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry<com.mojang.authlib.GameProfile>
```

## Constructors

- `UserListOpsEntry(com.mojang.authlib.GameProfile player, int permissionLevelIn, boolean bypassesPlayerLimitIn)`
- `UserListOpsEntry(com.google.gson.JsonObject p_i1150_1_)`

## Methods

- `boolean bypassesPlayerLimit()`
- `int getPermissionLevel()`
- `protected void onSerialization(com.google.gson.JsonObject data)`
