# EntityAINearestAttackableTarget

## Class signature

```java
public class EntityAINearestAttackableTarget<T extends EntityLivingBase > extends EntityAITarget
```

## Constructors

- `public EntityAINearestAttackableTarget( EntityCreature creature, java.lang.Class< T > classTarget, boolean checkSight)`
- `public EntityAINearestAttackableTarget( EntityCreature creature, java.lang.Class< T > classTarget, boolean checkSight, boolean onlyNearby)`
- `public EntityAINearestAttackableTarget( EntityCreature creature, java.lang.Class< T > classTarget, int chance, boolean checkSight, boolean onlyNearby, @Nullable com.google.common.base.Predicate<? super T > targetSelector)`

## Methods

- `public boolean shouldExecute()`
- `protected AxisAlignedBB getTargetableArea(double targetDistance)`
- `public void startExecuting()`