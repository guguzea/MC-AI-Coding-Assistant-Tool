# EntityAIWatchClosest

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWatchClosest

## Class signature

```java
public class EntityAIWatchClosest extends EntityAIBase
```

## Constructors

- `EntityAIWatchClosest(EntityLiving entityIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance)`
- `EntityAIWatchClosest(EntityLiving entityIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance, float chanceIn)`

## Methods

- `void resetTask()`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected Entity closestEntity`
- `protected EntityLiving entity`
- `protected float maxDistanceForPlayer`
- `protected java.lang.Class<? extends Entity> watchedClass`