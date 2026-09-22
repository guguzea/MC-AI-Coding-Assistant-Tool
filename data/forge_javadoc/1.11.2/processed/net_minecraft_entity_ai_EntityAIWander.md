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

- `boolean continueExecuting()`
- `protected Vec3d getPosition()`
- `void makeUpdate()`
- `void setExecutionChance(int newchance)`
- `boolean shouldExecute()`
- `void startExecuting()`

## Fields

- `protected EntityCreature entity`
- `protected int executionChance`
- `protected boolean mustUpdate`
- `protected double speed`
- `protected double xPosition`
- `protected double yPosition`
- `protected double zPosition`