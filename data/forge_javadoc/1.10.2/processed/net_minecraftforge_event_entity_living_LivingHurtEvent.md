# LivingHurtEvent

## Class signature

```java
public class LivingHurtEvent extends LivingEvent
```

## Constructors

- `public LivingHurtEvent( EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `public DamageSource getSource()`
- `public float getAmount()`
- `public void setAmount(float amount)`

## Description

LivingHurtEvent is fired when an Entity is set to be hurt. This event is fired whenever an Entity is hurt in EntityLivingBase.damageEntity(DamageSource, float) and EntityPlayer.damageEntity(DamageSour