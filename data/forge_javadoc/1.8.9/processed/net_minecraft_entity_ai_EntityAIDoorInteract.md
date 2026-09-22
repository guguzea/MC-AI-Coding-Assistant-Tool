# EntityAIDoorInteract

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIDoorInteract

## Class signature

```java
public abstract class EntityAIDoorInteract extends EntityAIBase
```

## Constructors

- `EntityAIDoorInteract(EntityLiving entityIn)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected BlockDoor doorBlock` — The wooden door block
- `protected BlockPos doorPosition`
- `protected EntityLiving theEntity`