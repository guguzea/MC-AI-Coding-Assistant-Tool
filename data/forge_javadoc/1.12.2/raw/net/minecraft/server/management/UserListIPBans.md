---
title: "UserListIPBans"
description: "public class UserListIPBans extends UserList <java.lang.String, UserListIPBansEntry >"
package: "net/minecraft/server/management"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/UserListIPBans.html"
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

- `protected UserListEntry <java.lang.String> createEntry(JsonObject entryData)`
- `public boolean isBanned(java.net.SocketAddress address)`
- `public UserListIPBansEntry getBanEntry(java.net.SocketAddress address)`
