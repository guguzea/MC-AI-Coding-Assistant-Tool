# EntityAITempt

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITempt

## Class signature

```java
public class EntityAITempt extends EntityAIBase
```

## Constructors

- `EntityAITempt(EntityCreature temptedEntityIn, double speedIn, boolean scaredByPlayerMovementIn, java.util.Set<Item> temptItemIn)`
- `EntityAITempt(EntityCreature temptedEntityIn, double speedIn, Item temptItemIn, boolean scaredByPlayerMovementIn)`

## Methods

- `boolean isRunning()`
- `protected boolean isTempting(ItemStack stack)`
- `void resetTask()`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`