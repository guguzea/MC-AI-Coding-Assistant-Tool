# EntityAIAvoidEntity

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity > extends EntityAIBase
```

## Constructors

- `public EntityAIAvoidEntity( EntityCreature theEntityIn, java.lang.Class< T > classToAvoidIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`
- `public EntityAIAvoidEntity( EntityCreature theEntityIn, java.lang.Class< T > classToAvoidIn, com.google.common.base.Predicate<? super T > avoidTargetSelectorIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`

## Methods

- `public boolean shouldExecute()`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`