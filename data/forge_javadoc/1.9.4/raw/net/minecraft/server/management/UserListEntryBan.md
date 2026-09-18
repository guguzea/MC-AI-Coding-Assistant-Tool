---
title: "UserListEntryBan"
description: "public abstract class UserListEntryBan<T> extends UserListEntry <T>"
package: "net/minecraft/server/management"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/UserListEntryBan.html"
sourceType: javadoc
---

# UserListEntryBan

## Class signature

```java
public abstract class UserListEntryBan<T> extends UserListEntry <T>
```

## Constructors

- `public UserListEntryBan( T valueIn, java.util.Date startDate, java.lang.String banner, java.util.Date endDate, java.lang.String banReason)`
- `protected UserListEntryBan( T valueIn, com.google.gson.JsonObject json)`

## Methods

- `public java.util.Date getBanEndDate()`
- `public java.lang.String getBanReason()`
- `protected void onSerialization(com.google.gson.JsonObject data)`
