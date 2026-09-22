# DamagePredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.DamagePredicate

## Class signature

```java
public class DamagePredicate extends java.lang.Object
```

## Constructors

- `DamagePredicate()`
- `DamagePredicate(MinMaxBounds dealt, MinMaxBounds taken, EntityPredicate sourceEntity, java.lang.Boolean blocked, DamageSourcePredicate type)`

## Methods

- `static DamagePredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, DamageSource source, float dealt, float taken, boolean blocked)`

## Fields

- `static DamagePredicate ANY`