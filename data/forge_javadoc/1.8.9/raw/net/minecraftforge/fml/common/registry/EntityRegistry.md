---
title: "EntityRegistry"
description: "public class EntityRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/EntityRegistry.html"
sourceType: javadoc
---

# EntityRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `static void addSpawn(java.lang.Class<? extends EntityLiving> entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)` — Add a spawn entry for the supplied entity in the supplied BiomeGenBase list
- `static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)` — Add a spawn entry for the supplied entity in the supplied BiomeGenBase list
- `@Deprecated static int findGlobalUniqueEntityId()`
- `static java.util.Map<java.lang.String, EntityList.EntityEggInfo> getEggs()` — Returns a Unmodifiable view of the registered entity eggs list.
- `static EntityRegistry instance()`
- `EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity> clazz, boolean keepLooking)`
- `EntityRegistry.EntityRegistration lookupModSpawn(ModContainer mc, int modEntityId)`
- `static void registerEgg(java.lang.Class<? extends Entity> entityClass, int primary, int secondary)` — Registers a spawn egg for the specified entity class.
- `@Deprecated static void registerGlobalEntityID(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id)`
- `@Deprecated static void registerGlobalEntityID(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, int backgroundEggColour, int foregroundEggColour)`
- `static void registerModEntity(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)` — Register the mod entity type with FML
- `static void registerModEntity(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates, int eggPrimary, int eggSecondary)` — Register the mod entity type with FML This will also register a spawn egg.
- `static void removeSpawn(java.lang.Class<? extends EntityLiving> entityClass, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)` — Remove the spawn entry for the supplied entity
- `static void removeSpawn(java.lang.String entityName, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)` — Remove the spawn entry for the supplied entity
- `boolean tryTrackingEntity(EntityTracker entityTracker, Entity entity)`
