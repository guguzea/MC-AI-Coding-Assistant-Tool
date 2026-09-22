# ZombieEvent.SummonAidEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.ZombieEvent → net.minecraftforge.event.entity.living.ZombieEvent.SummonAidEvent

## Class signature

```java
public static class ZombieEvent.SummonAidEvent extends ZombieEvent
```

## Constructors

- `SummonAidEvent(EntityZombie entity, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`

## Fields

- `EntityLivingBase attacker`
- `EntityZombie customSummonedAid` — Populate this field to have a custom zombie instead of a normal zombie summoned
- `double summonChance`
- `World world`
- `int x`
- `int y`
- `int z`