# EntityPredicate

## Class signature

```java
public class EntityPredicate extends java.lang.Object
```

## Constructors

- `public EntityPredicate( ResourceLocation type, DistancePredicate distance, LocationPredicate location, MobEffectsPredicate effects, NBTPredicate nbt)`

## Methods

- `public boolean test( EntityPlayerMP player, Entity entity)`
- `public static EntityPredicate deserialize(JsonElement element)`