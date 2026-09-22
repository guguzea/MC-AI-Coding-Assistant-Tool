# EntityAITarget

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITarget

## Class signature

```java
public abstract class EntityAITarget extends EntityAIBase
```

## Constructors

- `EntityAITarget(EntityCreature creature, boolean checkSight)`
- `EntityAITarget(EntityCreature creature, boolean checkSight, boolean onlyNearby)`

## Methods

- `boolean continueExecuting()`
- `protected double getTargetDistance()`
- `protected boolean isSuitableTarget(EntityLivingBase target, boolean includeInvincibles)`
- `static boolean isSuitableTarget(EntityLiving attacker, EntityLivingBase target, boolean includeInvincibles, boolean checkSight)`
- `void resetTask()`
- `EntityAITarget setUnseenMemoryTicks(int p_190882_1_)`
- `void startExecuting()`

## Fields

- `protected boolean shouldCheckSight`
- `protected EntityLivingBase target`
- `protected EntityCreature taskOwner`
- `protected int unseenMemoryTicks`