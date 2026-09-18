# LivingDamageEvent

## Class signature

```java
public class LivingDamageEvent extends LivingEvent
```

## Constructors

- `public LivingDamageEvent( EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `public DamageSource getSource()`
- `public float getAmount()`
- `public void setAmount(float amount)`

## Description

LivingDamageEvent is fired just before damage is applied to entity. At this point armor, potion and absorption modifiers have already been applied to damage - this is FINAL value. Also note that appro