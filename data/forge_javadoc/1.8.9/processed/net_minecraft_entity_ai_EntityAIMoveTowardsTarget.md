# EntityAIMoveTowardsTarget

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIMoveTowardsTarget

## Class signature

```java
public class EntityAIMoveTowardsTarget extends EntityAIBase
```

## Constructors

- `EntityAIMoveTowardsTarget(EntityCreature creature, double speedIn, float targetMaxDistance)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task