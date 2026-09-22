---
title: "EntityList"
description: "public class EntityList extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityList.html"
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
- `static java.util.Set<ResourceLocation> getEntityNameList()`
- `static java.lang.String getEntityString(Entity entityIn)`
- `static int getID(java.lang.Class<? extends Entity> cls)`
- `static ResourceLocation getKey(java.lang.Class<? extends Entity> entityIn)`
- `static ResourceLocation getKey(Entity entityIn)`
- `static java.lang.String getTranslationName(ResourceLocation p_191302_0_)`
- `static void init()`
- `static boolean isMatchingName(Entity entityIn, ResourceLocation entityName)`
- `static boolean isRegistered(ResourceLocation entityName)`
- `static Entity newEntity(java.lang.Class<? extends Entity> p_191304_0_, World p_191304_1_)`

## Fields

- `static java.util.Map<ResourceLocation, EntityList.EntityEggInfo> ENTITY_EGGS`
- `static ResourceLocation LIGHTNING_BOLT`
