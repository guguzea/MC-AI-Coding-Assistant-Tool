# EntityAITempt

## Class signature

```java
public class EntityAITempt extends EntityAIBase
```

## Constructors

- `public EntityAITempt( EntityCreature temptedEntityIn, double speedIn, Item temptItemIn, boolean scaredByPlayerMovementIn)`
- `public EntityAITempt( EntityCreature temptedEntityIn, double speedIn, boolean scaredByPlayerMovementIn, java.util.Set< Item > temptItemIn)`

## Methods

- `public boolean shouldExecute()`
- `protected boolean isTempting( ItemStack stack)`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`
- `public boolean isRunning()`