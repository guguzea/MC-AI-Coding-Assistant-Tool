# EntityAIWander

## Class signature

```java
public class EntityAIWander extends EntityAIBase
```

## Constructors

- `public EntityAIWander( EntityCreature creatureIn, double speedIn)`
- `public EntityAIWander( EntityCreature creatureIn, double speedIn, int chance)`

## Methods

- `public boolean shouldExecute()`
- `@Nullable protected Vec3d getPosition()`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void makeUpdate()`
- `public void setExecutionChance(int newchance)`