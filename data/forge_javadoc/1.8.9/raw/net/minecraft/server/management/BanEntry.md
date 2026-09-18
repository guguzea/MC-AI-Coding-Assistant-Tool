---
title: "BanEntry"
description: "public abstract class BanEntry<T> extends UserListEntry <T>"
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/BanEntry.html"
sourceType: javadoc
---

# BanEntry

## Class signature

```java
public abstract class BanEntry<T> extends UserListEntry <T>
```

## Constructors

- `public BanEntry( T valueIn, java.util.Date startDate, java.lang.String banner, java.util.Date endDate, java.lang.String banReason)`
- `protected BanEntry( T valueIn, JsonObject json)`

## Methods

- `public java.util.Date getBanEndDate()`
- `public java.lang.String getBanReason()`
- `protected void onSerialization(JsonObject data)`
