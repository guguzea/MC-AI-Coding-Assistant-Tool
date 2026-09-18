# EnderTeleportEvent

## Class signature

```java
public class EnderTeleportEvent extends LivingEvent
```

## Constructors

- `public EnderTeleportEvent( EntityLivingBase entity, double targetX, double targetY, double targetZ, float attackDamage)`

## Description

Event for when an Enderman teleports or an ender pearl is used. Can be used to either modify the target position, or cancel the teleport outright.