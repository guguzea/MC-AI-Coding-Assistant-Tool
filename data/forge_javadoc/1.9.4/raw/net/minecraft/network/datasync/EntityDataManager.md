---
title: "EntityDataManager"
description: "public class EntityDataManager extends java.lang.Object"
package: "net/minecraft/network/datasync"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/datasync/EntityDataManager.html"
sourceType: javadoc
---

# EntityDataManager

**Inheritance:** java.lang.Object → net.minecraft.network.datasync.EntityDataManager

## Class signature

```java
public class EntityDataManager extends java.lang.Object
```

## Constructors

- `EntityDataManager(Entity entityIn)`

## Methods

- `static<T> DataParameter<T> createKey(java.lang.Class<? extends Entity> clazz, DataSerializer<T> serializer)`
- `<T> T get(DataParameter<T> key)`
- `java.util.List<EntityDataManager.DataEntry<?>> getAll()`
- `java.util.List<EntityDataManager.DataEntry<?>> getDirty()`
- `boolean isDirty()`
- `boolean isEmpty()`
- `static java.util.List<EntityDataManager.DataEntry<?>> readEntries(PacketBuffer buf)`
- `<T> void register(DataParameter<T> key, T value)`
- `<T> void set(DataParameter<T> key, T value)`
- `void setClean()`
- `<T> void setDirty(DataParameter<T> key)`
- `protected<T> void setEntryValue(EntityDataManager.DataEntry<T> target, EntityDataManager.DataEntry<?> source)`
- `void setEntryValues(java.util.List<EntityDataManager.DataEntry<?>> entriesIn)`
- `static void writeEntries(java.util.List<EntityDataManager.DataEntry<?>> entriesIn, PacketBuffer buf)`
- `void writeEntries(PacketBuffer buf)`
