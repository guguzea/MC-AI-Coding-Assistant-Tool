# EntityAIAvoidEntity

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIAvoidEntity<T>

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity> extends EntityAIBase
```

## Constructors

- `EntityAIAvoidEntity(EntityCreature theEntityIn, java.lang.Class<T> classToAvoidIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`
- `EntityAIAvoidEntity(EntityCreature theEntityIn, java.lang.Class<T> classToAvoidIn, com.google.common.base.Predicate<? super T> avoidTargetSelectorIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`

## Methods

- `boolean continueExecuting()`
- `void resetTask()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected T closestLivingEntity`
- `protected EntityCreature theEntity`