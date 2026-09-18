# EntityAIAvoidEntity

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity > extends EntityAIBase
```

## Constructors

- `public EntityAIAvoidEntity( EntityCreature entityIn, java.lang.Class< T > classToAvoidIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`
- `public EntityAIAvoidEntity( EntityCreature entityIn, java.lang.Class< T > classToAvoidIn, <any> avoidTargetSelectorIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`

## Methods

- `public boolean shouldExecute()`
- `public boolean shouldContinueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`