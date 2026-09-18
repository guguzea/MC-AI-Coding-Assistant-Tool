# EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `public static EntityRegistry instance()`
- `public static void registerModEntity(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)`
- `public static void registerGlobalEntityID(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id)`
- `public static void registerGlobalEntityID(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id, int backgroundEggColour, int foregroundEggColour)`
- `public static void addSpawn(java.lang.Class<? extends EntityLiving > entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `public static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType spawnList, BiomeGenBase ... biomes)`
- `public static void removeSpawn(java.lang.Class<? extends EntityLiving > entityClass, EnumCreatureType typeOfCreature, BiomeGenBase ... biomes)`
- `public static void removeSpawn(java.lang.String entityName, EnumCreatureType spawnList, BiomeGenBase ... biomes)`
- `public static int findGlobalUniqueEntityId()`
- `public EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity > clazz, boolean keepLooking)`
- `public EntityRegistry.EntityRegistration lookupModSpawn( ModContainer mc, int modEntityId)`
- `public boolean tryTrackingEntity( EntityTracker entityTracker, Entity entity)`

## Description

Register the mod entity type with FML