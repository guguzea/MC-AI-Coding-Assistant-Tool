---
title: "UserList"
description: "public class UserList<K, V extends UserListEntry<K>> extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/management/UserList.html"
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

- `void addEntry(V entry)`
- `protected UserListEntry<K> createEntry(JsonObject entryData)`
- `V getEntry(K obj)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(K obj)`
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
- `protected static Logger LOGGER`
