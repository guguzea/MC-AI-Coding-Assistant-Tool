---
title: "EntityRegistry"
description: "public class EntityRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/EntityRegistry.html"
sourceType: javadoc
---

# EntityRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `static void addSpawn(java.lang.Class<? extends EntityLiving> entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)` — Add a spawn entry for the supplied entity in the supplied BiomeGenBase list
- `static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)` — Add a spawn entry for the supplied entity in the supplied BiomeGenBase list
- `static EntityRegistry instance()`
- `EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity> clazz, boolean keepLooking)`
- `EntityRegistry.EntityRegistration lookupModSpawn(ModContainer mc, int modEntityId)`
- `static void registerEgg(java.lang.Class<? extends Entity> entityClass, int primary, int secondary)` — Registers a spawn egg for the specified entity class.
- `static void registerModEntity(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)` — Register the mod entity type with FML
- `static void registerModEntity(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates, int eggPrimary, int eggSecondary)` — Register the mod entity type with FML This will also register a spawn egg.
- `static void removeSpawn(java.lang.Class<? extends EntityLiving> entityClass, EnumCreatureType typeOfCreature, Biome ... biomes)` — Remove the spawn entry for the supplied entity
- `static void removeSpawn(java.lang.String entityName, EnumCreatureType typeOfCreature, Biome ... biomes)` — Remove the spawn entry for the supplied entity
- `boolean tryTrackingEntity(EntityTracker entityTracker, Entity entity)`
