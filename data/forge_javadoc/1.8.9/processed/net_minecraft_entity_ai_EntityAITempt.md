# EntityAITempt

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITempt

## Class signature

```java
public class EntityAITempt extends EntityAIBase
```

## Constructors

- `EntityAITempt(EntityCreature temptedEntityIn, double speedIn, Item temptItemIn, boolean scaredByPlayerMovementIn)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `boolean isRunning()`
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task