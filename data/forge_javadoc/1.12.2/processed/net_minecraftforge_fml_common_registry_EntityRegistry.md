# EntityRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.EntityRegistry

## Class signature

```java
public class EntityRegistry extends java.lang.Object
```

## Methods

- `static void addSpawn(java.lang.Class<? extends EntityLiving> entityClass, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)` — Add a spawn entry for the supplied entity in the supplied Biome list
- `static void addSpawn(java.lang.String entityName, int weightedProb, int min, int max, EnumCreatureType typeOfCreature, Biome ... biomes)` — Add a spawn entry for the supplied entity in the supplied Biome list
- `static EntityEntry getEntry(java.lang.Class<? extends Entity> entityClass)`
- `static EntityRegistry instance()`
- `EntityRegistry.EntityRegistration lookupModSpawn(java.lang.Class<? extends Entity> clazz, boolean keepLooking)`
- `EntityRegistry.EntityRegistration lookupModSpawn(ModContainer mc, int modEntityId)`
- `static void registerEgg(ResourceLocation name, int primary, int secondary)` — Registers a spawn egg for the specified entity class.
- `static void registerModEntity(ResourceLocation registryName, java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates)` — Register the mod entity type with FML
- `static void registerModEntity(ResourceLocation registryName, java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id, java.lang.Object mod, int trackingRange, int updateFrequency, boolean sendsVelocityUpdates, int eggPrimary, int eggSecondary)` — Register the mod entity type with FML This will also register a spawn egg.
- `static void removeSpawn(java.lang.Class<? extends EntityLiving> entityClass, EnumCreatureType typeOfCreature, Biome ... biomes)` — Remove the spawn entry for the supplied entity
- `static void removeSpawn(java.lang.String entityName, EnumCreatureType typeOfCreature, Biome ... biomes)` — Remove the spawn entry for the supplied entity
- `boolean tryTrackingEntity(EntityTracker entityTracker, Entity entity)`