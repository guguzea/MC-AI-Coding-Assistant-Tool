# LivingAttackEvent

## Class signature

```java
public class LivingAttackEvent extends LivingEvent
```

## Constructors

- `public LivingAttackEvent( EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `public DamageSource getSource()`
- `public float getAmount()`

## Description

LivingAttackEvent is fired when a living Entity is attacked. This event is fired whenever an Entity is attacked in EntityLivingBase#attackEntityFrom(DamageSource, float) and EntityPlayer#attackEntityF