---
title: "UserListBans"
description: "public class UserListBans extends UserList <com.mojang.authlib.GameProfile, UserListBansEntry >"
package: "net/minecraft/server/management"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/UserListBans.html"
sourceType: javadoc
---

# UserListBans

## Class signature

```java
public class UserListBans extends UserList <com.mojang.authlib.GameProfile, UserListBansEntry >
```

## Constructors

- `public UserListBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `public boolean isBanned(com.mojang.authlib.GameProfile profile)`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `public com.mojang.authlib.GameProfile getBannedProfile(java.lang.String username)`
