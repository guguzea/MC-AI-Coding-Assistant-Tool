---
title: "BanList"
description: "public class BanList extends UserList <java.lang.String, IPBanEntry >"
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/BanList.html"
sourceType: javadoc
---

# BanList

## Class signature

```java
public class BanList extends UserList <java.lang.String, IPBanEntry >
```

## Constructors

- `public BanList(java.io.File bansFile)`

## Methods

- `protected UserListEntry <java.lang.String> createEntry(JsonObject entryData)`
- `public boolean isBanned(java.net.SocketAddress address)`
- `public IPBanEntry getBanEntry(java.net.SocketAddress address)`
