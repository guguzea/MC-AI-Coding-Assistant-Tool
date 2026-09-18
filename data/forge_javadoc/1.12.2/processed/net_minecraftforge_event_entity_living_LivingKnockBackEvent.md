# LivingKnockBackEvent

## Class signature

```java
public class LivingKnockBackEvent extends LivingEvent
```

## Constructors

- `public LivingKnockBackEvent( EntityLivingBase target, Entity attacker, float strength, double ratioX, double ratioZ)`

## Methods

- `public Entity getAttacker()`
- `public float getStrength()`
- `public double getRatioX()`
- `public double getRatioZ()`
- `public Entity getOriginalAttacker()`
- `public float getOriginalStrength()`
- `public double getOriginalRatioX()`
- `public double getOriginalRatioZ()`
- `public void setAttacker( Entity attacker)`
- `public void setStrength(float strength)`
- `public void setRatioX(double ratioX)`
- `public void setRatioZ(double ratioZ)`

## Description

LivingKnockBackEvent is fired when a living entity is about to be knocked back. This event is fired whenever an Entity is knocked back in EntityLivingBase.attackEntityFrom(DamageSource, float) , Entit