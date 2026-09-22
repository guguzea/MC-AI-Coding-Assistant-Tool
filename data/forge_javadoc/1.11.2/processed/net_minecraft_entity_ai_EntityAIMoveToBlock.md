# EntityAIMoveToBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIMoveToBlock

## Class signature

```java
public abstract class EntityAIMoveToBlock extends EntityAIBase
```

## Constructors

- `EntityAIMoveToBlock(EntityCreature creature, double speedIn, int length)`

## Methods

- `boolean continueExecuting()`
- `protected boolean getIsAboveDestination()`
- `boolean shouldExecute()`
- `protected abstract boolean shouldMoveTo(World worldIn, BlockPos pos)`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected BlockPos destinationBlock`
- `protected int runDelay`