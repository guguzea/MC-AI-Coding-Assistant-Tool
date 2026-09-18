# LivingSpawnEvent.AllowDespawn

## Constructors

- `public AllowDespawn( EntityLiving entity)`

## Description

Fired each tick for despawnable mobs to allow control over despawning. Result#DEFAULT will pass the mob on to vanilla despawn mechanics. Result#ALLOW will force the mob to despawn. Result#DENY will fo