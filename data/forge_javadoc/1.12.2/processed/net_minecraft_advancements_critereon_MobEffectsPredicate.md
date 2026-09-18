# MobEffectsPredicate

## Class signature

```java
public class MobEffectsPredicate extends java.lang.Object
```

## Constructors

- `public MobEffectsPredicate(java.util.Map< Potion , MobEffectsPredicate.InstancePredicate > effects)`

## Methods

- `public boolean test( Entity entityIn)`
- `public boolean test( EntityLivingBase entityIn)`
- `public boolean test(java.util.Map< Potion , PotionEffect > potions)`
- `public static MobEffectsPredicate deserialize(JsonElement element)`