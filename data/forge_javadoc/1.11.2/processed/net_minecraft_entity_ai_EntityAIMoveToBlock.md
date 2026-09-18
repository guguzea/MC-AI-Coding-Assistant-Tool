# EntityAIMoveToBlock

## Class signature

```java
public abstract class EntityAIMoveToBlock extends EntityAIBase
```

## Constructors

- `public EntityAIMoveToBlock( EntityCreature creature, double speedIn, int length)`

## Methods

- `public boolean shouldExecute()`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void updateTask()`
- `protected boolean getIsAboveDestination()`
- `protected abstract boolean shouldMoveTo( World worldIn, BlockPos pos)`