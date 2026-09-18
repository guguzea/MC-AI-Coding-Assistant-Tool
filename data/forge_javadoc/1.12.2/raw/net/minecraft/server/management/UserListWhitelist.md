---
title: "UserListWhitelist"
description: "public class UserListWhitelist extends UserList <GameProfile, UserListWhitelistEntry >"
package: "net/minecraft/server/management"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/UserListWhitelist.html"
sourceType: javadoc
---

# UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList <GameProfile, UserListWhitelistEntry >
```

## Constructors

- `public UserListWhitelist(java.io.File p_i1132_1_)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public boolean isWhitelisted(GameProfile profile)`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile getByName(java.lang.String profileName)`
