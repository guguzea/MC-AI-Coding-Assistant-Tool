# LivingSpawnEvent.SpecialSpawn

## Constructors

- `public SpecialSpawn( EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`

## Methods

- `@Deprecated public SpecialSpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public MobSpawnerBaseLogic getSpawner()`

## Description

SpecialSpawn is fired when an Entity is to be spawned. This allows you to do special inializers in the new entity. This event is fired via the ForgeEventFactory.doSpecialSpawn(EntityLiving, World, flo