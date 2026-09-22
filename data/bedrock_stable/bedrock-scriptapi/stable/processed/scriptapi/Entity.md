> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.217Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Entity (class)

```ts
export class Entity {
```

Represents the state of an entity (a mob, the player, or
other moving objects like minecarts) in the world.

## Members（65）

### `private`
```ts
private constructor();
```

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
Dimension that the entity is currently within.

@throws This property can throw when used.

{@link minecraftcommon.EngineError}

{@link InvalidEntityError}
/

### `id`
```ts
readonly id: string;
```

@remarks
Unique identifier of the entity. This identifier is intended
to be consistent across loads of a world instance. No
meaning should be inferred from the value and structure of
this unique identifier - do not parse or interpret it. This
property is accessible even if {@link Entity.isValid} is
false.

/

### `isClimbing`
```ts
readonly isClimbing: boolean;
```

@remarks
Whether the entity is touching a climbable block. For
example, a player next to a ladder or a spider next to a
stone wall.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isFalling`
```ts
readonly isFalling: boolean;
```

@remarks
Whether the entity has a fall distance greater than 0, or
greater than 1 while gliding.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isInWater`
```ts
readonly isInWater: boolean;
```

@remarks
Whether any part of the entity is inside a water block.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isOnGround`
```ts
readonly isOnGround: boolean;
```

@remarks
Whether the entity is on top of a solid block. This property
may behave in unexpected ways. This property will always be
true when an Entity is first spawned, and if the Entity has
no gravity this property may be incorrect.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isSleeping`
```ts
readonly isSleeping: boolean;
```

@remarks
If true, the entity is currently sleeping.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isSneaking`
```ts
isSneaking: boolean;
```

@remarks
Whether the entity is sneaking - that is, moving more slowly
and more quietly.

This property can't be edited in restricted-execution mode.

/

### `isSprinting`
```ts
readonly isSprinting: boolean;
```

@remarks
Whether the entity is sprinting. For example, a player using
the sprint action, an ocelot running away or a pig boosting
with Carrot on a Stick.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isSwimming`
```ts
readonly isSwimming: boolean;
```

@remarks
Whether the entity is in the swimming state. For example, a
player using the swim action or a fish in water.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether the entity can be manipulated by script. A
Player is considered valid when it's EntityLifetimeState is
set to Loaded.

/

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of this entity's name used in .lang
files.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `location`
```ts
readonly location: Vector3;
```

@remarks
Current location of the entity.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `nameplateDepthTested`
```ts
nameplateDepthTested: boolean;
```

@remarks
Boolean which determines if the player nameplate should be
depth tested for visibility.

This property can't be edited in restricted-execution mode.

/

### `nameplateRenderDistance`
```ts
nameplateRenderDistance: number;
```

@remarks
Float that determines the render distance of this entity's
nameplate.

This property can't be edited in restricted-execution mode.

/

### `nameTag`
```ts
nameTag: string;
```

@remarks
Given name of the entity.

This property can't be edited in restricted-execution mode.

/

### `scoreboardIdentity`
```ts
readonly scoreboardIdentity?: ScoreboardIdentity;
```

@remarks
Returns a scoreboard identity that represents this entity.
Will remain valid when the entity is killed.

/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Identifier of the type of the entity - for example,
'minecraft:skeleton'. This property is accessible even if
{@link Entity.isValid} is false.

/

### `addEffect`
```ts
addEffect(effectType: EffectType | string, duration: number, options?: EntityEffectOptions): Effect | undefined;
```

@remarks
Adds or updates an effect, like poison, to the entity.

This function can't be called in restricted-execution mode.

@param effectType
Type of effect to add to the entity.
@param duration
Amount of time, in ticks, for the effect to apply. There are
20 ticks per second. Use {@link TicksPerSecond} constant to
convert between ticks and seconds. The value must be within
the range [0, 20000000].
Bounds: [1, 20000000]
@param options
Additional options for the effect.
@returns
Returns nothing if the effect was added or updated
successfully. This can throw an error if the duration or
amplifier are outside of the valid ranges, or if the effect
does not exist.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
@example spawnPoisonedVillager.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

function spawnPoisonedVillager(targetLocation: DimensionLocation) {
  const villagerType = 'minecraft:villager_v2<minecraft:ageable_grow_up>';
  const villager = targetLocation.dimension.spawnEntity(villagerType, targetLocation);
  const duration = 20;

  villager.addEffect(MinecraftEffectTypes.Poison, duration, { amplifier: 1 });
}
```
@example quickFoxLazyDog.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes, MinecraftEffectTypes } from '@minecraft/vanilla-data';

function quickFoxLazyDog(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const fox = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Fox, {
    x: targetLocation.x + 1,
    y: targetLocation.y + 2,
    z: targetLocation.z + 3,
  });

  fox.addEffect(MinecraftEffectTypes.Speed, 10, {
    amplifier: 2,
  });
  log('Created a fox.');

  const wolf = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Wolf, {
    x: targetLocation.x + 4,
    y: targetLocation.y + 2,
    z: targetLocation.z + 3,
  });
  wolf.addEffect(MinecraftEffectTypes.Slowness, 10, {
    amplifier: 2,
  });
  wolf.isSneaking = true;
  log('Created a sneaking wolf.', 1);
}
```
/

### `addItem`
```ts
addItem(itemStack: ItemStack): ItemStack | undefined;
```

@remarks
Adds an item to the entity's inventory.

This function can't be called in restricted-execution mode.

@returns
Returns undefined if the item was fully added or returns an
ItemStack with the remaining count.
@throws This function can throw errors.

{@link ContainerRulesError}

{@link Error}

{@link InvalidEntityComponentError}

{@link InvalidEntityError}
/

### `addTag`
```ts
addTag(tag: string): boolean;
```

@remarks
Adds a specified tag to an entity.

This function can't be called in restricted-execution mode.

@param tag
Content of the tag to add. The tag must be less than 256
characters.
@returns
Returns true if the tag was added successfully. This can
fail if the tag already exists on the entity.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}
@example tagsQuery.ts
```typescript
import { EntityQueryOptions, DimensionLocation } from '@minecraft/server';

function tagsQuery(targetLocation: DimensionLocation) {
  const mobs = ['creeper', 'skeleton', 'sheep'];

  // create some sample mob data
  for (let i = 0; i < 10; i++) {
    const mobTypeId = mobs[i % mobs.length];
    const entity = targetLocation.dimension.spawnEntity(mobTypeId, targetLocation);
    entity.addTag('mobparty.' + mobTypeId);
  }

  const eqo: EntityQueryOptions = {
    tags: ['mobparty.skeleton'],
  };

  for (const entity of targetLocation.dimension.getEntities(eqo)) {
    entity.kill();
  }
}
```
/

### `applyDamage`
```ts
applyDamage(amount: number, options?: EntityApplyDamageByProjectileOptions | EntityApplyDamageOptions): boolean;
```

@remarks
Applies a set of damage to an entity.

This function can't be called in restricted-execution mode.

@param amount
Amount of damage to apply.
@param options
Additional options about the source of damage, which may add
additional effects or spur additional behaviors on this
entity.
@returns
Whether the entity takes any damage. This can return false
if the entity is invulnerable or if the damage applied is
less than or equal to 0.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
@example applyDamageThenHeal.ts
```typescript
import { system, EntityHealthComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function applyDamageThenHeal(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const skelly = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Skeleton, targetLocation);

  skelly.applyDamage(19); // skeletons have max damage of 20 so this is a near-death skeleton

  system.runTimeout(() => {
    const health = skelly.getComponent(EntityComponentTypes.Health) as EntityHealthComponent;
    log('Skeleton health before heal: ' + health?.currentValue);
    health?.resetToMaxValue();
    log('Skeleton health after heal: ' + health?.currentValue);
  }, 20);
}
```
/

### `applyImpulse`
```ts
applyImpulse(vector: Vector3): void;
```

@remarks
Applies impulse vector to the current velocity of the
entity.

This function can't be called in restricted-execution mode.

@param vector
Impulse vector.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}
@example applyImpulse.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function applyImpulse(targetLocation: DimensionLocation) {
  const zombie = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Zombie, targetLocation);

  zombie.clearVelocity();

  // throw the zombie up in the air
  zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
}
```
/

### `applyKnockback`
```ts
applyKnockback(horizontalForce: VectorXZ, verticalStrength: number): void;
```

@remarks
Applies impulse vector to the current velocity of the
entity.

This function can't be called in restricted-execution mode.

@param verticalStrength
Knockback strength for the vertical vector.
@throws This function can throw errors.

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
@example bounceSkeletons.ts
```typescript
import { EntityQueryOptions, DimensionLocation } from '@minecraft/server';

function bounceSkeletons(targetLocation: DimensionLocation) {
  const mobs = ['creeper', 'skeleton', 'sheep'];

  // create some sample mob data
  for (let i = 0; i < 10; i++) {
    targetLocation.dimension.spawnEntity(mobs[i % mobs.length], targetLocation);
  }

  const eqo: EntityQueryOptions = {
    type: 'skeleton',
  };

  for (const entity of targetLocation.dimension.getEntities(eqo)) {
    entity.applyKnockback(0, 0, 0, 1);
  }
}
```
/

### `clearDynamicProperties`
```ts
clearDynamicProperties(): void;
```

@remarks
Clears all dynamic properties that have been set on this
entity.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `clearVelocity`
```ts
clearVelocity(): void;
```

@remarks
Sets the current velocity of the Entity to zero.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}
@example applyImpulse.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function applyImpulse(targetLocation: DimensionLocation) {
  const zombie = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Zombie, targetLocation);

  zombie.clearVelocity();

  // throw the zombie up in the air
  zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
}
```
/

### `extinguishFire`
```ts
extinguishFire(useEffects?: boolean): boolean;
```

@remarks
Extinguishes the fire if the entity is on fire. Note that
you can call getComponent('minecraft:onfire') and, if
present, the entity is on fire.

This function can't be called in restricted-execution mode.

@param useEffects
Whether to show any visual effects connected to the
extinguishing.
Defaults to: true
@returns
Returns whether the entity was on fire.
@throws This function can throw errors.

{@link InvalidEntityError}
@example setOnFire.ts
```typescript
import { system, EntityOnFireComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function setOnFire(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const skelly = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Skeleton, targetLocation);

  skelly.setOnFire(20, true);

  system.runTimeout(() => {
    const onfire = skelly.getComponent(EntityComponentTypes.OnFire) as EntityOnFireComponent;
    log(onfire?.onFireTicksRemaining + ' fire ticks remaining.');

    skelly.extinguishFire(true);
    log('Never mind. Fire extinguished.');
  }, 20);
}
```
/

### `getAABB`
```ts
getAABB(): AABB;
```

@remarks
Gets the entity's collision bounds.

@returns
An axis-aligned bounding box.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getAllBlocksStandingOn`
```ts
getAllBlocksStandingOn(options?: GetBlocksStandingOnOptions): Block[];
```

@remarks
Gets the solid blocks that this entity is directly standing
on. Ignores pressure plates.

@param options
Additional configuration options for what blocks are
returned.
@returns
The solid blocks that this entity is directly standing on.
Returns an empty list if the entity is jumping or flying.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getBlockFromViewDirection`
```ts
getBlockFromViewDirection(options?: BlockRaycastOptions): BlockRaycastHit | undefined;
```

@remarks
Returns the first intersecting block from the direction that
this entity is looking at.

@param options
Additional configuration options for the ray cast.
@returns
Returns the first intersecting block from the direction that
this entity is looking at.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getBlockStandingOn`
```ts
getBlockStandingOn(options?: GetBlocksStandingOnOptions): Block | undefined;
```

@remarks
Gets a single solid block closest to the center of the
entity that this entity is directly standing on. Ignores
pressure plates.

@param options
Additional configuration options for what block is returned.
@returns
A single solid block closest to the center of the entity
that this entity is directly standing on. Undefined if
entity is flying or jumping.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getComponent`
```ts
getComponent<T extends string>(componentId: T): EntityComponentReturnType<T> | undefined;
```

@remarks
Gets a component (that represents additional capabilities)
for an entity.

@param componentId
The identifier of the component (e.g., 'minecraft:health').
If no namespace prefix is specified, 'minecraft:' is
assumed. Available component IDs can be found as part of the
{@link EntityComponentTypes} enum.
@returns
Returns the component if it exists on the entity, otherwise
undefined.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getComponents`
```ts
getComponents(): EntityComponent[];
```

@remarks
Returns all scripting components that are present on this
entity.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getDynamicProperty`
```ts
getDynamicProperty(identifier: string): boolean | number | string | Vector3 | undefined;
```

@remarks
Returns a property value.

@param identifier
The property identifier.
@returns
Returns the value for the property, or undefined if the
property has not been set.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getDynamicPropertyIds`
```ts
getDynamicPropertyIds(): string[];
```

@remarks
Returns the available set of dynamic property identifiers
that have been used on this entity.

@returns
A string array of the dynamic properties set on this entity.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getDynamicPropertyTotalByteCount`
```ts
getDynamicPropertyTotalByteCount(): number;
```

@remarks
Returns the total size, in bytes, of all the dynamic
properties that are currently stored for this entity. This
includes the size of both the key and the value.  This can
be useful for diagnosing performance warning signs - if, for
example, an entity has many megabytes of associated dynamic
properties, it may be slow to load on various devices.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getEffect`
```ts
getEffect(effectType: EffectType | string): Effect | undefined;
```

@remarks
Returns the effect for the specified EffectType on the
entity, undefined if the effect is not present, or throws an
error if the effect does not exist.

@param effectType
The effect identifier.
@returns
Effect object for the specified effect, undefined if the
effect is not present, or throws an error if the effect does
not exist.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
/

### `getEffects`
```ts
getEffects(): Effect[];
```

@remarks
Returns a set of effects applied to this entity.

@returns
List of effects.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getEntitiesFromViewDirection`
```ts
getEntitiesFromViewDirection(options?: EntityRaycastOptions): EntityRaycastHit[];
```

@remarks
Gets the entities that this entity is looking at by
performing a ray cast from the view of this entity.

@param options
Additional configuration options for the ray cast.
@returns
Returns a set of entities from the direction that this
entity is looking at.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `getHeadLocation`
```ts
getHeadLocation(): Vector3;
```

@remarks
Returns the current location of the head component of this
entity.

@returns
Returns the current location of the head component of this
entity.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getProperty`
```ts
getProperty(identifier: string): boolean | number | string | undefined;
```

@remarks
Gets an entity Property value. If the property was set using
the setProperty function within the same tick, the updated
value will not be reflected until the subsequent tick.

@param identifier
The entity Property identifier.
@returns
Returns the current property value. For enum properties, a
string is returned. For float and int properties, a number
is returned. For undefined properties, undefined is
returned.
@throws
Throws if the entity is invalid.

{@link InvalidEntityError}
/

### `getRotation`
```ts
getRotation(): Vector2;
```

@remarks
Returns the current rotation component of this entity.

@returns
Returns a Vec2 containing the rotation of this entity (in
degrees).
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getTags`
```ts
getTags(): string[];
```

@remarks
Returns all tags associated with the entity.

@returns
An array containing all tags as strings.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getVelocity`
```ts
getVelocity(): Vector3;
```

@remarks
Returns the current velocity vector of the entity.

@returns
Returns the current velocity vector of the entity.
@throws This function can throw errors.

{@link InvalidEntityError}
@example getFireworkVelocity.ts
```typescript
import { system, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function getFireworkVelocity(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const fireworkRocket = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.FireworksRocket, targetLocation);

  system.runTimeout(() => {
    const velocity = fireworkRocket.getVelocity();

    log('Velocity of firework is: (x: ' + velocity.x + ', y:' + velocity.y + ', z:' + velocity.z + ')');
  }, 5);
}
```
/

### `getViewDirection`
```ts
getViewDirection(): Vector3;
```

@remarks
Returns the current view direction of the entity.

@returns
Returns the current view direction of the entity.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `hasComponent`
```ts
hasComponent(componentId: string): boolean;
```

@remarks
Returns true if the specified component is present on this
entity.

@param componentId
The identifier of the component (e.g., 'minecraft:rideable')
to retrieve. If no namespace prefix is specified,
'minecraft:' is assumed.
@returns
Returns true if the specified component is present on this
entity.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `hasTag`
```ts
hasTag(tag: string): boolean;
```

@remarks
Returns whether an entity has a particular tag.

@param tag
Identifier of the tag to test for.
@returns
Returns whether an entity has a particular tag.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `kill`
```ts
kill(): boolean;
```

@remarks
Kills this entity. The entity will drop loot as normal.

This function can't be called in restricted-execution mode.

@returns
Returns true if entity can be killed (even if it is already
dead), otherwise it returns false.
@throws This function can throw errors.

{@link InvalidEntityError}
@example tagsQuery.ts
```typescript
import { EntityQueryOptions, DimensionLocation } from '@minecraft/server';

function tagsQuery(targetLocation: DimensionLocation) {
  const mobs = ['creeper', 'skeleton', 'sheep'];

  // create some sample mob data
  for (let i = 0; i < 10; i++) {
    const mobTypeId = mobs[i % mobs.length];
    const entity = targetLocation.dimension.spawnEntity(mobTypeId, targetLocation);
    entity.addTag('mobparty.' + mobTypeId);
  }

  const eqo: EntityQueryOptions = {
    tags: ['mobparty.skeleton'],
  };

  for (const entity of targetLocation.dimension.getEntities(eqo)) {
    entity.kill();
  }
}
```
/

### `lookAt`
```ts
lookAt(targetLocation: Vector3): void;
```

@remarks
Sets the rotation of the entity to face a target location.
Both pitch and yaw will be set, if applicable, such as for
mobs where the pitch controls the head tilt and the yaw
controls the body rotation.

This function can't be called in restricted-execution mode.

@param targetLocation
The target location that this entity should face/look
towards.
@throws This function can throw errors.

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `matches`
```ts
matches(options: EntityQueryOptions): boolean;
```

@remarks
Matches the entity against the passed in options. Uses the
location of the entity for matching if the location is not
specified in the passed in EntityQueryOptions.

@param options
The query to perform the match against.
@returns
Returns true if the entity matches the criteria in the
passed in EntityQueryOptions, otherwise it returns false.
@throws
Throws if the query options are misconfigured.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `playAnimation`
```ts
playAnimation(animationName: string, options?: PlayAnimationOptions): void;
```

@remarks
Cause the entity to play the given animation.

This function can't be called in restricted-execution mode.

@param animationName
The animation identifier. e.g. animation.creeper.swelling
@param options
Additional options to control the playback and transitions
of the animation.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `remove`
```ts
remove(): void;
```

@remarks
Immediately removes the entity from the world. The removed
entity will not perform a death animation or drop loot upon
removal.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `removeEffect`
```ts
removeEffect(effectType: EffectType | string): boolean;
```

@remarks
Removes the specified EffectType on the entity, or returns
false if the effect is not present.

This function can't be called in restricted-execution mode.

@param effectType
The effect identifier.
@returns
Returns true if the effect has been removed. Returns false
if the effect is not found or does not exist.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
/

### `removeTag`
```ts
removeTag(tag: string): boolean;
```

@remarks
Removes a specified tag from an entity.

This function can't be called in restricted-execution mode.

@param tag
Content of the tag to remove.
@returns
Returns whether the tag existed on the entity.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `resetProperty`
```ts
resetProperty(identifier: string): boolean | number | string;
```

@remarks
Resets an Entity Property back to its default value, as
specified in the Entity's definition. This property change
is not applied until the next tick.

This function can't be called in restricted-execution mode.

@param identifier
The Entity Property identifier.
@returns
Returns the default property value. For enum properties, a
string is returned. For float and int properties, a number
is returned. For undefined properties, undefined is
returned.
@throws
Throws if the entity is invalid.

{@link minecraftcommon.EngineError}

{@link Error}

{@link InvalidEntityError}
/

### `runCommand`
```ts
runCommand(commandString: string): CommandResult;
```

@remarks
Runs a synchronous command on the entity.

This function can't be called in restricted-execution mode.

@param commandString
The command string. Note: This should not include a leading
forward slash.
@returns
A command result containing whether the command was
successful.
@throws This function can throw errors.

{@link CommandError}

{@link InvalidEntityError}
/

### `setDynamicProperties`
```ts
setDynamicProperties(values: Record<string, boolean | number | string | Vector3 | undefined>): void;
```

@remarks
Sets multiple dynamic properties with specific values.

@param values
A Record of key value pairs of the dynamic properties to
set. If the data value is null, it will remove that property
instead.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}
/

### `setDynamicProperty`
```ts
setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void;
```

@remarks
Sets a specified property to a value.

@param identifier
The property identifier.
@param value
Data value of the property to set. If the value is null, it
will remove the property instead.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}
/

### `setOnFire`
```ts
setOnFire(seconds: number, useEffects?: boolean): boolean;
```

@remarks
Sets an entity on fire (if it is not in water or rain). Note
that you can call getComponent('minecraft:onfire') and, if
present, the entity is on fire.

This function can't be called in restricted-execution mode.

@param seconds
Length of time to set the entity on fire.
@param useEffects
Whether side-effects should be applied (e.g. thawing freeze)
and other conditions such as rain or fire protection should
be taken into consideration.
Defaults to: true
@returns
Whether the entity was set on fire. This can fail if seconds
is less than or equal to zero, the entity is wet or the
entity is immune to fire.
@throws This function can throw errors.

{@link InvalidEntityError}
@example setOnFire.ts
```typescript
import { system, EntityOnFireComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function setOnFire(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const skelly = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Skeleton, targetLocation);

  skelly.setOnFire(20, true);

  system.runTimeout(() => {
    const onfire = skelly.getComponent(EntityComponentTypes.OnFire) as EntityOnFireComponent;
    log(onfire?.onFireTicksRemaining + ' fire ticks remaining.');

    skelly.extinguishFire(true);
    log('Never mind. Fire extinguished.');
  }, 20);
}
```
/

### `setProperty`
```ts
setProperty(identifier: string, value: boolean | number | string): void;
```

@remarks
Sets an Entity Property to the provided value. This property
change is not applied until the next tick.

This function can't be called in restricted-execution mode.

@param identifier
The Entity Property identifier.
@param value
The property value. The provided type must be compatible
with the type specified in the entity's definition.
@throws
Throws if the entity is invalid.
Throws if an invalid identifier is provided.
Throws if the provided value type does not match the
property type.
Throws if the provided value is outside the expected range
(int, float properties).
Throws if the provided string value does not match the set
of accepted enum values (enum properties

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
/

### `setRotation`
```ts
setRotation(rotation: Vector2): void;
```

@remarks
Sets the main rotation of the entity.

This function can't be called in restricted-execution mode.

@param rotation
The x and y rotation of the entity (in degrees). For most
mobs, the x rotation controls the head tilt and the y
rotation controls the body rotation.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `teleport`
```ts
teleport(location: Vector3, teleportOptions?: TeleportOptions): void;
```

@remarks
Teleports the selected entity to a new location

This function can't be called in restricted-execution mode.

@param location
New location for the entity.
@param teleportOptions
Options regarding the teleport operation.
@throws This function can throw errors.

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
@example teleport.ts
```typescript
import { system, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function teleport(targetLocation: DimensionLocation) {
  const cow = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Cow, targetLocation);

  system.runTimeout(() => {
    cow.teleport(
      { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 2 },
      {
        facingLocation: targetLocation,
      }
    );
  }, 20);
}
```
@example teleportMovement.ts
```typescript
import { system, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function teleportMovement(targetLocation: DimensionLocation) {
  const pig = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Pig, targetLocation);

  let inc = 1;
  const runId = system.runInterval(() => {
    pig.teleport(
      { x: targetLocation.x + inc / 4, y: targetLocation.y + inc / 4, z: targetLocation.z + inc / 4 },
      {
        facingLocation: targetLocation,
      }
    );

    if (inc > 100) {
      system.clearRun(runId);
    }
    inc++;
  }, 4);
}
```
/

### `triggerEvent`
```ts
triggerEvent(eventName: string): void;
```

@remarks
Triggers an entity type event. For every entity, a number of
events are defined in an entities' definition for key entity
behaviors; for example, creepers have a
minecraft:start_exploding type event.

This function can't be called in restricted-execution mode.

@param eventName
Name of the entity type event to trigger. If a namespace is
not specified, minecraft: is assumed.
@throws
If the event is not defined in the definition of the entity,
an error will be thrown.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
@example triggerEvent.ts
```typescript
// A function that spawns a creeper and triggers it to explode immediately
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function spawnExplodingCreeper(location: DimensionLocation) {
  const creeper = location.dimension.spawnEntity(MinecraftEntityTypes.Creeper, location);

  creeper.triggerEvent('minecraft:start_exploding_forced');
}
```
@example triggerEvent.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function triggerEvent(targetLocation: DimensionLocation) {
  const creeper = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Creeper, targetLocation);

  creeper.triggerEvent('minecraft:start_exploding_forced');
}
```
/

### `tryTeleport`
```ts
tryTeleport(location: Vector3, teleportOptions?: TeleportOptions): boolean;
```

@remarks
Attempts to try a teleport, but may not complete the
teleport operation (for example, if there are blocks at the
destination.)

This function can't be called in restricted-execution mode.

@param location
Location to teleport the entity to.
@param teleportOptions
Options regarding the teleport operation.
@returns
Returns whether the teleport succeeded. This can fail if the
destination chunk is unloaded or if the teleport would
result in intersecting with blocks.
@throws This function can throw errors.

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/
