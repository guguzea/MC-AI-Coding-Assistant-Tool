# DamagePredicate

## Class signature

```java
public class DamagePredicate extends java.lang.Object
```

## Constructors

- `public DamagePredicate()`
- `public DamagePredicate( MinMaxBounds dealt, MinMaxBounds taken, EntityPredicate sourceEntity, java.lang.Boolean blocked, DamageSourcePredicate type)`

## Methods

- `public boolean test( EntityPlayerMP player, DamageSource source, float dealt, float taken, boolean blocked)`
- `public static DamagePredicate deserialize(JsonElement element)`