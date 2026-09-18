---
title: "UserListWhitelist"
description: "public class UserListWhitelist extends UserList <com.mojang.authlib.GameProfile, UserListWhitelistEntry >"
package: "net/minecraft/server/management"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/UserListWhitelist.html"
sourceType: javadoc
---

# UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList <com.mojang.authlib.GameProfile, UserListWhitelistEntry >
```

## Constructors

- `public UserListWhitelist(java.io.File p_i1132_1_)`

## Methods

- `protected UserListEntry <com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public boolean isWhitelisted(com.mojang.authlib.GameProfile profile)`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `public com.mojang.authlib.GameProfile getByName(java.lang.String profileName)`
