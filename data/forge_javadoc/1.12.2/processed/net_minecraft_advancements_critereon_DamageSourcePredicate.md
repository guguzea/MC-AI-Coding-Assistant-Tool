# DamageSourcePredicate

## Class signature

```java
public class DamageSourcePredicate extends java.lang.Object
```

## Constructors

- `public DamageSourcePredicate()`
- `public DamageSourcePredicate(java.lang.Boolean isProjectile, java.lang.Boolean isExplosion, java.lang.Boolean bypassesArmor, java.lang.Boolean bypassesInvulnerability, java.lang.Boolean bypassesMagic, java.lang.Boolean isFire, java.lang.Boolean isMagic, EntityPredicate directEntity, EntityPredicate sourceEntity)`

## Methods

- `public boolean test( EntityPlayerMP player, DamageSource source)`
- `public static DamageSourcePredicate deserialize(JsonElement element)`