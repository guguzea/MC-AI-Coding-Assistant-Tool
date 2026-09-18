---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/EntityList.html"
sourceType: javadoc
---

# EntityList

## Class signature

```java
public class EntityList extends java.lang.Object
```

## Constructors

- `public EntityList()`

## Methods

- `public static void addMapping(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id)`
- `public static void addMapping(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int entityID, int baseColor, int spotColor)`
- `@Nullable public static Entity createEntityByName(java.lang.String entityName, World worldIn)`
- `@Nullable public static Entity createEntityFromNBT( NBTTagCompound nbt, World worldIn)`
- `@Nullable public static Entity createEntityByID(int entityID, World worldIn)`
- `@Nullable public static Entity createEntityByIDFromName(java.lang.String name, World worldIn)`
- `public static int getEntityID( Entity entityIn)`
- `@Nullable public static java.lang.Class<? extends Entity > getClassFromID(int entityID)`
- `public static java.lang.String getEntityString( Entity entityIn)`
- `public static java.lang.String getEntityStringFromClass(java.lang.Class<? extends Entity > entityClass)`
- `public static int getIDFromString(java.lang.String entityName)`
- `public static void init()`
- `public static java.util.List<java.lang.String> getEntityNameList()`
- `public static boolean isStringEntityName( Entity entityIn, java.lang.String entityName)`
- `public static boolean isStringValidEntityName(java.lang.String entityName)`
