---
title: "BanEntry"
description: "public abstract class BanEntry<T> extends UserListEntry<T>"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/BanEntry.html"
sourceType: javadoc
---

# BanEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry<T> → net.minecraft.server.management.BanEntry<T>

## Class signature

```java
public abstract class BanEntry<T> extends UserListEntry<T>
```

## Constructors

- `BanEntry(T valueIn, java.util.Date startDate, java.lang.String banner, java.util.Date endDate, java.lang.String banReason)`
- `BanEntry(T valueIn, JsonObject json)`

## Methods

- `java.util.Date getBanEndDate()`
- `java.lang.String getBanReason()`
- `protected void onSerialization(JsonObject data)`

## Fields

- `protected java.util.Date banEndDate`
- `protected java.lang.String bannedBy`
- `protected java.util.Date banStartDate`
- `static java.text.SimpleDateFormat dateFormat`
- `protected java.lang.String reason`
