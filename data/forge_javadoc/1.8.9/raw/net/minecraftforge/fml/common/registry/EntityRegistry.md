---
title: "EntityRegistry"
description: "Add a spawn entry for the supplied entity in the supplied BiomeGenBase list"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/EntityRegistry.html"
sourceType: javadoc
---

# EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `public static EntityRegistry instance()`
- `public static void registerModEntity(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)`
- `public static void registerModEntity(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates, int eggPrimary, int eggSecondary)`
- `public static void registerEgg(java.lang.Class<? extends Entity > entityClass, int primary, int secondary)`
- `public static java.util.Map<java.lang.String, EntityList.EntityEggInfo > getEggs()`
- `@Deprecated public static void registerGlobalEntityID(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id)`
- `@Deprecated public static void registerGlobalEntityID(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, int backgroundEggColour, int foregroundEggColour)`
- `public static void addSpawn(java.lang.Class<? extends EntityLiving > entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `public static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `public static void removeSpawn(java.lang.Class<? extends EntityLiving > entityClass, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `public static void removeSpawn(java.lang.String entityName, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `@Deprecated public static int findGlobalUniqueEntityId()`
- `public EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity > clazz, boolean keepLooking)`
- `public EntityRegistry.EntityRegistration lookupModSpawn( ModContainer mc, int modEntityId)`
- `public boolean tryTrackingEntity( EntityTracker entityTracker, Entity entity)`

## Description

Add a spawn entry for the supplied entity in the supplied BiomeGenBase list
