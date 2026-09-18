---
title: "UserListOps"
description: "public class UserListOps extends UserList <com.mojang.authlib.GameProfile, UserListOpsEntry >"
package: "net/minecraft/server/management"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/server/management/UserListOps.html"
sourceType: javadoc
---

# UserListOps

## Class signature

```java
public class UserListOps extends UserList <com.mojang.authlib.GameProfile, UserListOpsEntry >
```

## Constructors

- `public UserListOps(java.io.File saveFile)`

## Methods

- `protected UserListEntry <com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public int getPermissionLevel(com.mojang.authlib.GameProfile profile)`
- `public boolean bypassesPlayerLimit(com.mojang.authlib.GameProfile profile)`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `public com.mojang.authlib.GameProfile getGameProfileFromName(java.lang.String username)`
