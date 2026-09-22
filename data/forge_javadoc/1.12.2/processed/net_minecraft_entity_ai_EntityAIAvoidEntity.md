# EntityAIAvoidEntity

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIAvoidEntity<T>

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity> extends EntityAIBase
```

## Constructors

- `EntityAIAvoidEntity(EntityCreature entityIn, java.lang.Class<T> classToAvoidIn, <any> avoidTargetSelectorIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`
- `EntityAIAvoidEntity(EntityCreature entityIn, java.lang.Class<T> classToAvoidIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`

## Methods

- `void resetTask()`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected T closestLivingEntity`
- `protected EntityCreature entity`