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

- `protected AxisAlignedBB getTargetableArea(double targetDistance)`
- `boolean shouldExecute()`
- `void startExecuting()`

## Fields

- `protected EntityAINearestAttackableTarget.Sorter sorter`
- `protected java.lang.Class<T> targetClass`
- `protected T targetEntity`
- `protected<any> targetEntitySelector`