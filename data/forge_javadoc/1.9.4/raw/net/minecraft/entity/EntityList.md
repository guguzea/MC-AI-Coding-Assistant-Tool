---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/EntityList.html"
sourceType: javadoc
---

# EntityList

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityList

## Class signature

```java
public class EntityList extends java.lang.Object
```

## Constructors

- `EntityList()`

## Methods

- `static void addMapping(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id)`
- `static void addMapping(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int entityID, int baseColor, int spotColor)`
- `static Entity createEntityByID(int entityID, World worldIn)`
- `static Entity createEntityByIDFromName(java.lang.String name, World worldIn)`
- `static Entity createEntityByName(java.lang.String entityName, World worldIn)`
- `static Entity createEntityFromNBT(NBTTagCompound nbt, World worldIn)`
- `static java.lang.Class<? extends Entity> getClassFromID(int entityID)`
- `static int getEntityID(Entity entityIn)`
- `static java.util.List<java.lang.String> getEntityNameList()`
- `static java.lang.String getEntityString(Entity entityIn)`
- `static java.lang.String getEntityStringFromClass(java.lang.Class<? extends Entity> entityClass)`
- `static int getIDFromString(java.lang.String entityName)`
- `static void init()`
- `static boolean isStringEntityName(Entity entityIn, java.lang.String entityName)`
- `static boolean isStringValidEntityName(java.lang.String entityName)`

## Fields

- `static java.util.Map<java.lang.Class<? extends Entity>, java.lang.String> CLASS_TO_NAME`
- `static java.util.Map<java.lang.String, EntityList.EntityEggInfo> ENTITY_EGGS`
- `static java.util.Map<java.lang.Integer, java.lang.Class<? extends Entity>> ID_TO_CLASS`
- `static java.util.Map<java.lang.String, java.lang.Class<? extends Entity>> NAME_TO_CLASS`
