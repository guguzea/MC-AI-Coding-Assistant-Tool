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

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected Entity closestEntity` — The closest entity which is being watched by this one.
- `protected float maxDistanceForPlayer` — This is the Maximum distance that the AI will look for the Entity
- `protected EntityLiving theWatcher`
- `protected java.lang.Class<? extends Entity> watchedClass`