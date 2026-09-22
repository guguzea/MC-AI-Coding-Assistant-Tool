# EnderTeleportEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.EnderTeleportEvent

## Class signature

```java
public class EnderTeleportEvent extends LivingEvent
```

## Constructors

- `EnderTeleportEvent(EntityLivingBase entity, double targetX, double targetY, double targetZ, float attackDamage)`

## Methods

- `float getAttackDamage()`
- `double getTargetX()`
- `double getTargetY()`
- `double getTargetZ()`
- `void setAttackDamage(float attackDamage)`
- `void setTargetX(double targetX)`
- `void setTargetY(double targetY)`
- `void setTargetZ(double targetZ)`