> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.314Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityProjectileComponent (class)

```ts
export class EntityProjectileComponent extends EntityComponent {
```

## Members（16）

### `private`
```ts
private constructor();
```

### `airInertia`
```ts
airInertia: number;
```

@remarks
The fraction of the projectile's speed maintained every tick
while traveling through air.

This property can't be edited in restricted-execution mode.

/

### `catchFireOnHurt`
```ts
catchFireOnHurt: boolean;
```

@remarks
If true, the entity will be set on fire when hurt. The
default burn duration is 5 seconds. This duration can be
modified via the onFireTime property. The entity will not
catch fire if immune or if the entity is wet.

This property can't be edited in restricted-execution mode.

/

### `critParticlesOnProjectileHurt`
```ts
critParticlesOnProjectileHurt: boolean;
```

@remarks
If true, the projectile will spawn crit particles when hit
by a player. E.g. Player attacking a Shulker bullet.

This property can't be edited in restricted-execution mode.

/

### `destroyOnProjectileHurt`
```ts
destroyOnProjectileHurt: boolean;
```

@remarks
If true, the projectile will be destroyed when it takes
damage. E.g. Player attacking a Shulker bullet.

This property can't be edited in restricted-execution mode.

/

### `gravity`
```ts
gravity: number;
```

@remarks
The gravity applied to the projectile. When the entity is
not on the ground, subtracts this amount from the
projectile’s change in vertical position every tick. The
higher the value, the faster the projectile falls. If
negative, the entity will rise instead of fall.

This property can't be edited in restricted-execution mode.

/

### `hitEntitySound`
```ts
hitEntitySound?: string;
```

@remarks
The sound that plays when the projectile hits an entity.

This property can't be edited in restricted-execution mode.

/

### `hitGroundSound`
```ts
hitGroundSound?: string;
```

@remarks
The sound that plays when the projectile hits a block.

This property can't be edited in restricted-execution mode.

/

### `hitParticle`
```ts
hitParticle?: string;
```

@remarks
The particle that spawns when the projectile hits something.

This property can't be edited in restricted-execution mode.

/

### `lightningStrikeOnHit`
```ts
lightningStrikeOnHit: boolean;
```

@remarks
If true and the weather is thunder and the entity has line
of sight to the sky, the entity will be struck by lightning
when hit. E.g. A thrown Trident with the Channeling
enchantment.

This property can't be edited in restricted-execution mode.

/

### `liquidInertia`
```ts
liquidInertia: number;
```

@remarks
The fraction of the projectile's speed maintained every tick
while traveling through a liquid.

This property can't be edited in restricted-execution mode.

/

### `onFireTime`
```ts
onFireTime: number;
```

@remarks
Duration in seconds that the entity hit will be on fire for
when catchFireOnHurt is set to true.

This property can't be edited in restricted-execution mode.

/

### `owner`
```ts
owner?: Entity;
```

@remarks
The owner of the projectile. This is used to determine what
the projectile can collide with and damage. It also
determines which entity is assigned as the attacker.

This property can't be edited in restricted-execution mode.

/

### `shouldBounceOnHit`
```ts
shouldBounceOnHit: boolean;
```

@remarks
If true, the projectile will bounce off mobs when no damage
is taken. E.g. A spawning wither.

This property can't be edited in restricted-execution mode.

/

### `stopOnHit`
```ts
stopOnHit: boolean;
static readonly componentId = 'minecraft:projectile';
```

@remarks
If true, the projectile will stop moving when an entity is
hit as thought it had been blocked. E.g. Thrown trident on
hit behavior.

This property can't be edited in restricted-execution mode.

/

### `shoot`
```ts
shoot(velocity: Vector3, options?: ProjectileShootOptions): void;
```

@remarks
Shoots the projectile with a given velocity. The projectile
will be shot from its current location.

This function can't be called in restricted-execution mode.

@param velocity
The velocity to fire the projectile. This controls both the
speed and direction which which the projectile will be shot.
@param options
Optional configuration for the shoot.
@throws
Throws if the component or entity no longer exist.
/
