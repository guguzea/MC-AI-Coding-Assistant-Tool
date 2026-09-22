# LivingHurtEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingHurtEvent

## Class signature

```java
public class LivingHurtEvent extends LivingEvent
```

## Constructors

- `LivingHurtEvent(EntityLivingBase entity, DamageSource source, float amount)`

## Methods

- `float getAmount()`
- `DamageSource getSource()`
- `void setAmount(float amount)`