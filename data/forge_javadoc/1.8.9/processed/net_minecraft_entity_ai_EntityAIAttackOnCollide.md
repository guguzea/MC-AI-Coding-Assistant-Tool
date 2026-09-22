# EntityAIAttackOnCollide

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIAttackOnCollide

## Class signature

```java
public class EntityAIAttackOnCollide extends EntityAIBase
```

## Constructors

- `EntityAIAttackOnCollide(EntityCreature creature, java.lang.Class<? extends Entity> targetClass, double speedIn, boolean useLongMemory)`
- `EntityAIAttackOnCollide(EntityCreature creature, double speedIn, boolean useLongMemory)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `protected double func_179512_a(EntityLivingBase attackTarget)`
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected EntityCreature attacker`