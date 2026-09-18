# ZombieEvent.SummonAidEvent

## Constructors

- `public SummonAidEvent( EntityZombie entity, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`

## Description

SummonAidEvent is fired when a Zombie Entity is summoned. This event is fired whenever a Zombie Entity is summoned in EntityZombie#attackEntityFrom(DamageSource, float). This event is fired via the Fo