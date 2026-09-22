# EntityAIWatchClosest

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWatchClosest

## Class signature

```java
public class EntityAIWatchClosest extends EntityAIBase
```

## Constructors

- `EntityAIWatchClosest(EntityLiving entitylivingIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance)`
- `EntityAIWatchClosest(EntityLiving entitylivingIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance, float chanceIn)`

## Methods

- `boolean continueExecuting()`
- `void resetTask()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected Entity closestEntity`
- `protected float maxDistanceForPlayer`
- `protected EntityLiving theWatcher`
- `protected java.lang.Class<? extends Entity> watchedClass`