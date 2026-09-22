# EntityAIWander

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWander

## Class signature

```java
public class EntityAIWander extends EntityAIBase
```

## Constructors

- `EntityAIWander(EntityCreature creatureIn, double speedIn)`
- `EntityAIWander(EntityCreature creatureIn, double speedIn, int chance)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `void makeUpdate()` — Makes task to bypass chance
- `void setExecutionChance(int newchance)` — Changes task random possibility for execution
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task