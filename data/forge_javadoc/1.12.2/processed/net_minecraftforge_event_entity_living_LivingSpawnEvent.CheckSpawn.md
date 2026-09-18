# LivingSpawnEvent.CheckSpawn

## Constructors

- `public CheckSpawn( EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`

## Methods

- `@Deprecated public CheckSpawn( EntityLiving entity, World world, float x, float y, float z, boolean isSpawner)`
- `@Deprecated public CheckSpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public boolean isSpawner()`
- `public MobSpawnerBaseLogic getSpawner()`

## Description

Fires before mob spawn events. Result is significant: DEFAULT: use vanilla spawn rules ALLOW: allow the spawn DENY: deny the spawn