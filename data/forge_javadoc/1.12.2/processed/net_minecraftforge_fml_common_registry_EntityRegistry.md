# EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `public static EntityRegistry instance()`
- `public static void registerModEntity( ResourceLocation registryName, java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)`
- `public static void registerModEntity( ResourceLocation registryName, java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates, int eggPrimary, int eggSecondary)`
- `public static void registerEgg( ResourceLocation name, int primary, int secondary)`
- `public static void addSpawn(java.lang.Class<? extends EntityLiving > entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)`
- `public static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)`
- `public static void removeSpawn(java.lang.Class<? extends EntityLiving > entityClass, EnumCreatureType typeOfCreature, Biome ... biomes)`
- `public static void removeSpawn(java.lang.String entityName, EnumCreatureType typeOfCreature, Biome ... biomes)`
- `public EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity > clazz, boolean keepLooking)`
- `public EntityRegistry.EntityRegistration lookupModSpawn( ModContainer mc, int modEntityId)`
- `public boolean tryTrackingEntity( EntityTracker entityTracker, Entity entity)`
- `public static EntityEntry getEntry(java.lang.Class<? extends Entity > entityClass)`

## Description

Add a spawn entry for the supplied entity in the supplied Biome list