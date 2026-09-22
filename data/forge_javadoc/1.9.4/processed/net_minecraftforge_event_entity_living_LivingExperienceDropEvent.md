# LivingExperienceDropEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingExperienceDropEvent

## Class signature

```java
public class LivingExperienceDropEvent extends LivingEvent
```

## Constructors

- `LivingExperienceDropEvent(EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`

## Methods

- `EntityPlayer getAttackingPlayer()`
- `int getDroppedExperience()`
- `int getOriginalExperience()`
- `void setDroppedExperience(int droppedExperience)`