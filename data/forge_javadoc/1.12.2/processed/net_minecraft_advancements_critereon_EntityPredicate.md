# EntityPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EntityPredicate

## Class signature

```java
public class EntityPredicate extends java.lang.Object
```

## Constructors

- `EntityPredicate(ResourceLocation type, DistancePredicate distance, LocationPredicate location, MobEffectsPredicate effects, NBTPredicate nbt)`

## Methods

- `static EntityPredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, Entity entity)`

## Fields

- `static EntityPredicate ANY`