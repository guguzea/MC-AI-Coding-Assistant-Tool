---
title: "UserListOpsEntry"
description: "public class UserListOpsEntry extends UserListEntry<com.mojang.authlib.GameProfile>"
package: "net/minecraft/server/management"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/UserListOpsEntry.html"
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
