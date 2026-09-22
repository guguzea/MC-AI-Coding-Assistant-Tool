---
title: "UserList"
description: "public class UserList<K, V extends UserListEntry<K>> extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/UserList.html"
sourceType: javadoc
---

# UserList

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<K, V>

## Class signature

```java
public class UserList<K, V extends UserListEntry<K>> extends java.lang.Object
```

## Constructors

- `UserList(java.io.File saveFile)`

## Methods

- `void addEntry(V entry)` — Adds an entry to the list
- `protected UserListEntry<K> createEntry(JsonObject entryData)`
- `V getEntry(K obj)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(K obj)` — Gets the key value for the given object
- `java.io.File getSaveFile()`
- `protected java.util.Map<java.lang.String, V> getValues()`
- `protected boolean hasEntry(K entry)`
- `boolean isEmpty()`
- `boolean isLanServer()`
- `void readSavedFile()`
- `void removeEntry(K entry)`
- `void setLanServer(boolean state)`
- `void writeChanges()`

## Fields

- `protected Gson gson`
- `protected static Logger logger`
