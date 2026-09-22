---
title: "UserListOpsEntry"
description: "public class UserListOpsEntry extends UserListEntry<GameProfile>"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserListOpsEntry.html"
sourceType: javadoc
---

# UserListOpsEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<GameProfile> → net.minecraft.server.management.UserListOpsEntry

## Class signature

```java
public class UserListOpsEntry extends UserListEntry<GameProfile>
```

## Constructors

- `UserListOpsEntry(GameProfile p_i46492_1_, int p_i46492_2_, boolean p_i46492_3_)`
- `UserListOpsEntry(JsonObject p_i1150_1_)`

## Methods

- `boolean func_183024_b()`
- `int getPermissionLevel()` — Gets the permission level of the user, as defined in the "level" attribute of the ops.json file
- `protected void onSerialization(JsonObject data)`
