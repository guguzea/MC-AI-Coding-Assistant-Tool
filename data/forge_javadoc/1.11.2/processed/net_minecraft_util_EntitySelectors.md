# EntitySelectors

**Inheritance:** java.lang.Object → net.minecraft.util.EntitySelectors

## Class signature

```java
public final class EntitySelectors extends java.lang.Object
```

## Constructors

- `EntitySelectors()`

## Methods

- `static<T extends Entity> com.google.common.base.Predicate<T> getTeamCollisionPredicate(Entity entityIn)`
- `static com.google.common.base.Predicate<Entity> notRiding(Entity p_191324_0_)`
- `static<T extends Entity> com.google.common.base.Predicate<T> withinRange(double x, double y, double z, double range)`

## Fields

- `static com.google.common.base.Predicate<Entity> CAN_AI_TARGET`
- `static com.google.common.base.Predicate<Entity> HAS_INVENTORY`
- `static com.google.common.base.Predicate<Entity> IS_ALIVE`
- `static com.google.common.base.Predicate<Entity> IS_STANDALONE`
- `static com.google.common.base.Predicate<Entity> NOT_SPECTATING`