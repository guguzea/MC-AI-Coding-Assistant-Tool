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
- `public static boolean isSuitableTarget( EntityLiving attacker, @Nullable EntityLivingBase target, boolean includeInvincibles, boolean checkSight)`
- `protected boolean isSuitableTarget(@Nullable EntityLivingBase target, boolean includeInvincibles)`
- `public EntityAITarget setUnseenMemoryTicks(int p_190882_1_)`