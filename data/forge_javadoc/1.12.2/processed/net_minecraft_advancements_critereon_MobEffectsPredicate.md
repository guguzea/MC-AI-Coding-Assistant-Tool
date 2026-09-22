# MobEffectsPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.MobEffectsPredicate

## Class signature

```java
public class MobEffectsPredicate extends java.lang.Object
```

## Constructors

- `MobEffectsPredicate(java.util.Map<Potion, MobEffectsPredicate.InstancePredicate> effects)`

## Methods

- `static MobEffectsPredicate deserialize(JsonElement element)`
- `boolean test(Entity entityIn)`
- `boolean test(EntityLivingBase entityIn)`
- `boolean test(java.util.Map<Potion, PotionEffect> potions)`

## Fields

- `static MobEffectsPredicate ANY`