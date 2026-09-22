# DamageSourcePredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.DamageSourcePredicate

## Class signature

```java
public class DamageSourcePredicate extends java.lang.Object
```

## Constructors

- `DamageSourcePredicate()`
- `DamageSourcePredicate(java.lang.Boolean isProjectile, java.lang.Boolean isExplosion, java.lang.Boolean bypassesArmor, java.lang.Boolean bypassesInvulnerability, java.lang.Boolean bypassesMagic, java.lang.Boolean isFire, java.lang.Boolean isMagic, EntityPredicate directEntity, EntityPredicate sourceEntity)`

## Methods

- `static DamageSourcePredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, DamageSource source)`

## Fields

- `static DamageSourcePredicate ANY`