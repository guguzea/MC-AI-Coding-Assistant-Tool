---
title: "EntityRegistry"
description: "public class EntityRegistry extends java.lang.Object"
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/EntityRegistry.html"
sourceType: javadoc
---

# EntityRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.common.registry.EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `static void addSpawn(java.lang.Class<? extends EntityLiving> entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType spawnList, BiomeGenBase ... biomes)`
- `static int findGlobalUniqueEntityId()`
- `static EntityRegistry instance()`
- `EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity> clazz, boolean keepLooking)`
- `EntityRegistry.EntityRegistration lookupModSpawn(ModContainer mc, int modEntityId)`
- `static void registerGlobalEntityID(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id)`
- `static void registerGlobalEntityID(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, int backgroundEggColour, int foregroundEggColour)`
- `static void registerModEntity(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)` — Register the mod entity type with FML
- `static void removeSpawn(java.lang.Class<? extends EntityLiving> entityClass, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `static void removeSpawn(java.lang.String entityName, EnumCreatureType spawnList, BiomeGenBase ... biomes)`
- `boolean tryTrackingEntity(EntityTracker entityTracker, Entity entity)`
