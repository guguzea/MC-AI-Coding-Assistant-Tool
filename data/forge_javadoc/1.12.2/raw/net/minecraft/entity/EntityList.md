---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityList.html"
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

- `protected static EntityList.EntityEggInfo addSpawnInfo(java.lang.String id, int primaryColor, int secondaryColor)`
- `static Entity createEntityByID(int entityID, World worldIn)`
- `static Entity createEntityByIDFromName(ResourceLocation name, World worldIn)`
- `static Entity createEntityFromNBT(NBTTagCompound nbt, World worldIn)`
- `static java.lang.Class<? extends Entity> getClass(ResourceLocation key)`
- `static java.lang.Class<? extends Entity> getClassFromID(int entityID)`
- `static java.lang.Class<? extends Entity> getClassFromName(java.lang.String p_192839_0_)`
- `static java.util.Set<ResourceLocation> getEntityNameList()`
- `static java.lang.String getEntityString(Entity entityIn)`
- `static int getID(java.lang.Class<? extends Entity> cls)`
- `static ResourceLocation getKey(java.lang.Class<? extends Entity> entityIn)`
- `static ResourceLocation getKey(Entity entityIn)`
- `static java.lang.String getTranslationName(ResourceLocation entityType)`
- `static java.lang.String getValidTypeNames()`
- `static void init()`
- `static boolean isMatchingName(Entity entityIn, ResourceLocation entityName)`
- `static boolean isRegistered(ResourceLocation entityName)`
- `static Entity newEntity(java.lang.Class<? extends Entity> clazz, World worldIn)`

## Fields

- `static java.util.Map<ResourceLocation, EntityList.EntityEggInfo> ENTITY_EGGS`
- `static ResourceLocation LIGHTNING_BOLT`
