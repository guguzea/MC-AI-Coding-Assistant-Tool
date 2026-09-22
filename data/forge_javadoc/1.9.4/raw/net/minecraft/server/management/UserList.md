---
title: "UserList"
description: "public class UserList<K, V extends UserListEntry<K>> extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/UserList.html"
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
- `protected UserListEntry<K> createEntry(com.google.gson.JsonObject entryData)`
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

- `protected com.google.gson.Gson gson`
- `protected static org.apache.logging.log4j.Logger LOGGER`
