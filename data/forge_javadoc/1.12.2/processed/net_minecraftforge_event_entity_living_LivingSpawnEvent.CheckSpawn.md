# LivingSpawnEvent.CheckSpawn

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingSpawnEvent → net.minecraftforge.event.entity.living.LivingSpawnEvent.CheckSpawn

## Class signature

```java
public static class LivingSpawnEvent.CheckSpawn extends LivingSpawnEvent
```

## Constructors

- `@Deprecated CheckSpawn(EntityLiving entity, World world, float x, float y, float z)`
- `@Deprecated CheckSpawn(EntityLiving entity, World world, float x, float y, float z, boolean isSpawner)`
- `CheckSpawn(EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`

## Methods

- `MobSpawnerBaseLogic getSpawner()`
- `boolean isSpawner()`