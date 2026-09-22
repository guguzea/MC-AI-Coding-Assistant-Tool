# LootingLevelEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LootingLevelEvent

## Class signature

```java
public class LootingLevelEvent extends LivingEvent
```

## Constructors

- `LootingLevelEvent(EntityLivingBase entity, DamageSource damageSource, int lootingLevel)`

## Methods

- `DamageSource getDamageSource()`
- `int getLootingLevel()`
- `void setLootingLevel(int lootingLevel)`