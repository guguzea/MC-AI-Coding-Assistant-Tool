---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityList.html"
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

- `@Nullable public static ResourceLocation getKey( Entity entityIn)`
- `@Nullable public static ResourceLocation getKey(java.lang.Class<? extends Entity > entityIn)`
- `@Nullable public static java.lang.String getEntityString( Entity entityIn)`
- `@Nullable public static java.lang.String getTranslationName(@Nullable ResourceLocation p_191302_0_)`
- `@Nullable public static java.lang.Class<? extends Entity > getClassFromID(int entityID)`
- `public static int getID(java.lang.Class<? extends Entity > cls)`
- `public static java.lang.Class<? extends Entity > getClass( ResourceLocation key)`
- `@Nullable public static Entity newEntity(@Nullable java.lang.Class<? extends Entity > p_191304_0_, World p_191304_1_)`
- `@Nullable public static Entity createEntityByID(int entityID, World worldIn)`
- `@Nullable public static Entity createEntityByIDFromName( ResourceLocation name, World worldIn)`
- `@Nullable public static Entity createEntityFromNBT( NBTTagCompound nbt, World worldIn)`
- `public static java.util.Set< ResourceLocation > getEntityNameList()`
- `public static boolean isMatchingName( Entity entityIn, ResourceLocation entityName)`
- `public static boolean isRegistered( ResourceLocation entityName)`
- `public static void init()`
- `protected static EntityList.EntityEggInfo addSpawnInfo(java.lang.String id, int primaryColor, int secondaryColor)`
