# EntityAIMoveToBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIMoveToBlock

## Class signature

```java
public abstract class EntityAIMoveToBlock extends EntityAIBase
```

## Constructors

- `EntityAIMoveToBlock(EntityCreature creature, double speedIn, int length)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `protected boolean getIsAboveDestination()`
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `protected abstract boolean shouldMoveTo(World worldIn, BlockPos pos)` — Return true to set given position as destination
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected BlockPos destinationBlock` — Block to move to
- `protected int runDelay` — Controls task execution delay