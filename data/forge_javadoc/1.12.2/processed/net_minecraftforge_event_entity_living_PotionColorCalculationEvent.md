# PotionColorCalculationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.PotionColorCalculationEvent

## Class signature

```java
public class PotionColorCalculationEvent extends LivingEvent
```

## Constructors

- `PotionColorCalculationEvent(EntityLivingBase entity, int color, boolean hideParticle, java.util.Collection<PotionEffect> effectList)`

## Methods

- `boolean areParticlesHidden()`
- `int getColor()`
- `java.util.Collection<PotionEffect> getEffects()` — Note that returned list is unmodifiable.
- `void setColor(int color)`
- `void shouldHideParticles(boolean hideParticle)`