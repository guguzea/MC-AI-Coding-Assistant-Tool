# EntityAITarget

## Class signature

```java
public abstract class EntityAITarget extends EntityAIBase
```

## Constructors

- `public EntityAITarget( EntityCreature creature, boolean checkSight)`
- `public EntityAITarget( EntityCreature creature, boolean checkSight, boolean onlyNearby)`

## Methods

- `public boolean continueExecuting()`
- `protected double getTargetDistance()`
- `public void startExecuting()`
- `public void resetTask()`
- `public static boolean isSuitableTarget( EntityLiving attacker, EntityLivingBase target, boolean includeInvincibles, boolean checkSight)`
- `protected boolean isSuitableTarget( EntityLivingBase target, boolean includeInvincibles)`

## Description

If true, EntityAI targets must be able to be seen (cannot be blocked by walls) to be suitable targets.