---
title: "UserList"
description: "public class UserList<K,V extends UserListEntry <K>> extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/UserList.html"
sourceType: javadoc
---

# UserList

## Class signature

```java
public class UserList<K,V extends UserListEntry <K>> extends java.lang.Object
```

## Constructors

- `public UserList(java.io.File saveFile)`

## Methods

- `public boolean isLanServer()`
- `public void setLanServer(boolean state)`
- `public void addEntry( V entry)`
- `public V getEntry( K obj)`
- `public void removeEntry( K entry)`
- `public java.io.File getSaveFile()`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey( K obj)`
- `protected boolean hasEntry( K entry)`
- `protected UserListEntry < K > createEntry(com.google.gson.JsonObject entryData)`
- `protected java.util.Map<java.lang.String, V > getValues()`
- `public void writeChanges() throws java.io.IOException`
- `public boolean isEmpty()`
- `public void readSavedFile() throws java.io.IOException, java.io.FileNotFoundException`
