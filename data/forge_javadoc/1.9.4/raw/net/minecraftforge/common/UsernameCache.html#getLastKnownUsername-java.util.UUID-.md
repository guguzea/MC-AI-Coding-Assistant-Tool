---
title: "UsernameCache.html#getLastKnownUsername-java.util.UUID-"
description: "Caches player's last known usernames Modders should use getLastKnownUsername(UUID) to determine a players last known username. For convenience, getMap() is provided to get an immutable copy of the cac"
package: "net/minecraftforge/common"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/UsernameCache.html#getLastKnownUsername-java.util.UUID-"
sourceType: javadoc
---

# UsernameCache.html#getLastKnownUsername-java.util.UUID-

## Class signature

```java
public final class UsernameCache extends java.lang.Object
```

## Methods

- `protected static void setUsername(java.util.UUID uuid, java.lang.String username)`
- `protected static boolean removeUsername(java.util.UUID uuid)`
- `@Nullable public static java.lang.String getLastKnownUsername(java.util.UUID uuid)`
- `public static boolean containsUUID(java.util.UUID uuid)`
- `public static java.util.Map<java.util.UUID,java.lang.String> getMap()`
- `protected static void save()`
- `protected static void load()`

## Description

Caches player's last known usernames Modders should use getLastKnownUsername(UUID) to determine a players last known username. For convenience, getMap() is provided to get an immutable copy of the cac
