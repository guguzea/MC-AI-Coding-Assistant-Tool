---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityList.html"
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

- `public static ResourceLocation getKey( Entity entityIn)`
- `public static ResourceLocation getKey(java.lang.Class<? extends Entity > entityIn)`
- `public static java.lang.String getEntityString( Entity entityIn)`
- `public static java.lang.String getTranslationName( ResourceLocation entityType)`
- `public static java.lang.Class<? extends Entity > getClassFromID(int entityID)`
- `public static java.lang.Class<? extends Entity > getClassFromName(java.lang.String p_192839_0_)`
- `public static int getID(java.lang.Class<? extends Entity > cls)`
- `public static java.lang.Class<? extends Entity > getClass( ResourceLocation key)`
- `public static Entity newEntity(java.lang.Class<? extends Entity > clazz, World worldIn)`
- `public static Entity createEntityByID(int entityID, World worldIn)`
- `public static Entity createEntityByIDFromName( ResourceLocation name, World worldIn)`
- `public static Entity createEntityFromNBT( NBTTagCompound nbt, World worldIn)`
- `public static java.util.Set< ResourceLocation > getEntityNameList()`
- `public static boolean isMatchingName( Entity entityIn, ResourceLocation entityName)`
- `public static boolean isRegistered( ResourceLocation entityName)`
- `public static java.lang.String getValidTypeNames()`
- `public static void init()`
- `protected static EntityList.EntityEggInfo addSpawnInfo(java.lang.String id, int primaryColor, int secondaryColor)`
