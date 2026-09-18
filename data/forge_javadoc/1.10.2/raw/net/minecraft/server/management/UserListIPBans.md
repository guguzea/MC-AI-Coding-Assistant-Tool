---
title: "UserListIPBans"
description: "public class UserListIPBans extends UserList <java.lang.String, UserListIPBansEntry >"
package: "net/minecraft/server/management"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/management/UserListIPBans.html"
sourceType: javadoc
---

# UserListIPBans

## Class signature

```java
public class UserListIPBans extends UserList <java.lang.String, UserListIPBansEntry >
```

## Constructors

- `public UserListIPBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <java.lang.String> createEntry(com.google.gson.JsonObject entryData)`
- `public boolean isBanned(java.net.SocketAddress address)`
- `public UserListIPBansEntry getBanEntry(java.net.SocketAddress address)`
