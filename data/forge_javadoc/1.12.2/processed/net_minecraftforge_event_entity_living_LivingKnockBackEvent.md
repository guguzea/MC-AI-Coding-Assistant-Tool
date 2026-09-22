# LivingKnockBackEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingKnockBackEvent

## Class signature

```java
public class LivingKnockBackEvent extends LivingEvent
```

## Constructors

- `LivingKnockBackEvent(EntityLivingBase target, Entity attacker, float strength, double ratioX, double ratioZ)`

## Methods

- `Entity getAttacker()`
- `Entity getOriginalAttacker()`
- `double getOriginalRatioX()`
- `double getOriginalRatioZ()`
- `float getOriginalStrength()`
- `double getRatioX()`
- `double getRatioZ()`
- `float getStrength()`
- `void setAttacker(Entity attacker)`
- `void setRatioX(double ratioX)`
- `void setRatioZ(double ratioZ)`
- `void setStrength(float strength)`

## Fields

- `protected Entity attacker`
- `protected Entity originalAttacker`
- `protected double originalRatioX`
- `protected double originalRatioZ`
- `protected float originalStrength`
- `protected double ratioX`
- `protected double ratioZ`
- `protected float strength`