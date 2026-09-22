# EntityAINearestAttackableTarget

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITarget → net.minecraft.entity.ai.EntityAINearestAttackableTarget<T>

## Class signature

```java
public class EntityAINearestAttackableTarget<T extends EntityLivingBase> extends EntityAITarget
```

## Constructors

- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, boolean checkSight)`
- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, boolean checkSight, boolean onlyNearby)`
- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, int chance, boolean checkSight, boolean onlyNearby, <any> targetSelector)`

## Methods

- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task

## Fields

- `protected java.lang.Class<T> targetClass`
- `protected EntityLivingBase targetEntity`
- `protected<any> targetEntitySelector`
- `protected EntityAINearestAttackableTarget.Sorter theNearestAttackableTargetSorter` — Instance of EntityAINearestAttackableTargetSorter.