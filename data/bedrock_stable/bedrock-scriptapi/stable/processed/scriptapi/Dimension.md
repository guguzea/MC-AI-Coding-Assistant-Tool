> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.199Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Dimension (class)

```ts
export class Dimension {
```

A class that represents a particular dimension (e.g., The
End) within a world.

## Members（33）

### `private`
```ts
private constructor();
```

### `heightRange`
```ts
readonly heightRange: minecraftcommon.NumberRange;
```

@remarks
Height range of the dimension.

@throws This property can throw when used.
/

### `id`
```ts
readonly id: string;
```

@remarks
Identifier of the dimension.

/

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of a dimension's name used by
language files.

/

### `calculateClosestBiomeFromSeed`
```ts
calculateClosestBiomeFromSeed(
  pos: Vector3,
  biomeToFind: BiomeType | string,
  options?: BiomeSearchOptions,
): Vector3 | undefined;
```

@remarks
Calculates the location of the closest biome of a particular
type from the world seed. Note that
calculateClosestBiomeFromSeed can be an expensive operation,
so avoid using many of these calls within a particular tick.
The result is derived purely from the world generation
algorithm and the world seed, so the returned location may
not reflect the actual current terrain if biomes have been
modified after generation.

@param pos
Starting location to look for a biome to find.
@param biomeToFind
Identifier of the biome to look for.
@param options
Additional selection criteria for a biome search.
@returns
Returns a location of the biome, or undefined if a biome
could not be found.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link Error}
/

### `containsBiomes`
```ts
containsBiomes(volume: BlockVolumeBase, biomeFilter: BiomeFilter, isSuperset: boolean): boolean;
```

@remarks
Checks if an area contains the specified biomes. If the area
is partially inside world boundaries, only the area that is
in bounds will be searched. This operation takes longer
proportional to both the area of the volume and the number
of biomes to check.

@param volume
Area to check biomes in.
@param biomeFilter
A list of biomes to include and exclude. A list of tags to
include and exclude. Will return false if a biome is found
in the area that is in the excluded list or contains any of
the excluded tags.
@param isSuperset
Superset is used to determine the strictness of the filter.
If superset is set to true then the area must contain one or
more biomes in the included list or that contains all of the
included tags. If superset is set to false then the area
must contain only biomes in the included list and that
contain all of the included tags
@returns
Returns true if the biomes in the area match the filter
settings passed in. Otherwise, returns false.
@throws
An error will be thrown if the area provided includes
unloaded chunks.
An error will be thrown if the area provided is completely
outside the world boundaries.
An error will be thrown if an unknown biome name is
provided.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link LocationOutOfWorldBoundariesError}

{@link UnloadedChunksError}
/

### `containsBlock`
```ts
containsBlock(volume: BlockVolumeBase, filter: BlockFilter, allowUnloadedChunks?: boolean): boolean;
```

@remarks
Searches the block volume for a block that satisfies the
block filter.

@param volume
Volume of blocks that will be checked.
@param filter
Block filter that will be checked against each block in the
volume.
@param allowUnloadedChunks
If set to true will suppress the UnloadedChunksError if some
or all of the block volume is outside of the loaded chunks.
Will only check the block locations that are within the
loaded chunks in the volume.
Defaults to: false
@returns
Returns true if at least one block in the volume satisfies
the filter, false otherwise.
@throws This function can throw errors.

{@link Error}

{@link UnloadedChunksError}
/

### `createExplosion`
```ts
createExplosion(location: Vector3, radius: number, explosionOptions?: ExplosionOptions): boolean;
```

@remarks
Creates an explosion at the specified location.

This function can't be called in restricted-execution mode.

@param location
The location of the explosion.
@param radius
Radius, in blocks, of the explosion to create.
Bounds: [0, 1000]
@param explosionOptions
Additional configurable options for the explosion.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example createExplosion.ts
```typescript
import { DimensionLocation } from '@minecraft/server';

function createExplosion(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  log('Creating an explosion of radius 10.');
  targetLocation.dimension.createExplosion(targetLocation, 10);
}
```
@example createNoBlockExplosion.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function createNoBlockExplosion(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const explodeNoBlocksLoc = Vector3Utils.floor(Vector3Utils.add(targetLocation, { x: 1, y: 2, z: 1 }));

  log('Creating an explosion of radius 15 that does not break blocks.');
  targetLocation.dimension.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
}
```
@example createExplosions.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function createExplosions(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const explosionLoc = Vector3Utils.add(targetLocation, { x: 0.5, y: 0.5, z: 0.5 });

  log('Creating an explosion of radius 15 that causes fire.');
  targetLocation.dimension.createExplosion(explosionLoc, 15, { causesFire: true });

  const belowWaterLoc = Vector3Utils.add(targetLocation, { x: 3, y: 1, z: 3 });

  log('Creating an explosion of radius 10 that can go underwater.');
  targetLocation.dimension.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
}
```
/

### `fillBlocks`
```ts
fillBlocks(
  volume: BlockVolumeBase,
  block: BlockPermutation | BlockType | string,
  options?: BlockFillOptions,
): ListBlockVolume;
```

@remarks
Fills an area of blocks with a specific block type.

This function can't be called in restricted-execution mode.

@param volume
Volume of blocks to be filled.
@param block
Type of block to fill the volume with.
@param options
A set of additional options, such as a block filter which
can be used to include / exclude specific blocks in the
fill.
@returns
Returns a ListBlockVolume which contains all the blocks that
were placed.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link Error}

{@link UnloadedChunksError}
/

### `getBiome`
```ts
getBiome(location: Vector3): BiomeType;
```

@remarks
Returns the biome type at the specified location.

@param location
Location at which to check the biome.
@throws
An error will be thrown if the location is out of world
bounds.
An error will be thrown if the location is in an unloaded
chunk.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getBlock`
```ts
getBlock(location: Vector3): Block | undefined;
```

@remarks
Returns a block instance at the given location.

@param location
The location at which to return a block.
@returns
Block at the specified location, or 'undefined' if asking
for a block at an unloaded chunk.
@throws
PositionInUnloadedChunkError: Exception thrown when trying
to interact with a Block object that isn't in a loaded and
ticking chunk anymore

PositionOutOfWorldBoundariesError: Exception thrown when
trying to interact with a position outside of dimension
height range


{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getBlockAbove`
```ts
getBlockAbove(location: Vector3, options?: BlockRaycastOptions): Block | undefined;
```

@remarks
Gets the first block found above a given block location
based on the given options (by default will find the first
solid block above).

@param location
Location to retrieve the block above from.
@param options
The options to decide if a block is a valid result.
@throws This function can throw errors.
/

### `getBlockBelow`
```ts
getBlockBelow(location: Vector3, options?: BlockRaycastOptions): Block | undefined;
```

@remarks
Gets the first block found below a given block location
based on the given options (by default will find the first
solid block below).

@param location
Location to retrieve the block below from.
@param options
The options to decide if a block is a valid result.
@throws This function can throw errors.
/

### `getBlockFromRay`
```ts
getBlockFromRay(location: Vector3, direction: Vector3, options?: BlockRaycastOptions): BlockRaycastHit | undefined;
```

@remarks
Gets the first block that intersects with a vector emanating
from a location.

@param location
Location from where to initiate the ray check.
@param direction
Vector direction to cast the ray.
@param options
Additional options for processing this raycast query.
@throws This function can throw errors.
/

### `getBlocks`
```ts
getBlocks(volume: BlockVolumeBase, filter: BlockFilter, allowUnloadedChunks?: boolean): ListBlockVolume;
```

@remarks
Gets all the blocks in a volume that satisfy the filter.

@param volume
Volume of blocks that will be checked.
@param filter
Block filter that will be checked against each block in the
volume.
@param allowUnloadedChunks
If set to true will suppress the UnloadedChunksError if some
or all of the block volume is outside of the loaded chunks.
Will only check the block locations that are within the
loaded chunks in the volume.
Defaults to: false
@returns
Returns the ListBlockVolume that contains all the block
locations that satisfied the block filter.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link Error}

{@link minecraftcommon.InvalidArgumentError}

{@link UnloadedChunksError}
/

### `getEntities`
```ts
getEntities(options?: EntityQueryOptions): Entity[];
```

@remarks
Returns a set of entities based on a set of conditions
defined via the EntityQueryOptions set of filter criteria.

@param options
Additional options that can be used to filter the set of
entities returned.
@returns
An entity array.
@throws This function can throw errors.

{@link CommandError}

{@link minecraftcommon.InvalidArgumentError}
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
@example testThatEntityIsFeatherItem.ts
```typescript
import { EntityItemComponent, EntityComponentTypes, DimensionLocation } from '@minecraft/server';

function testThatEntityIsFeatherItem(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const items = targetLocation.dimension.getEntities({
    location: targetLocation,
    maxDistance: 20,
  });

  for (const item of items) {
    const itemComp = item.getComponent(EntityComponentTypes.Item) as EntityItemComponent;

    if (itemComp) {
      if (itemComp.itemStack.typeId.endsWith('feather')) {
        log('Success! Found a feather', 1);
      }
    }
  }
}
```
/

### `getEntitiesAtBlockLocation`
```ts
getEntitiesAtBlockLocation(location: Vector3): Entity[];
```

@remarks
Returns a set of entities at a particular location.

@param location
The location at which to return entities.
@returns
Zero or more entities at the specified location.
/

### `getEntitiesFromRay`
```ts
getEntitiesFromRay(location: Vector3, direction: Vector3, options?: EntityRaycastOptions): EntityRaycastHit[];
```

@remarks
Gets entities that intersect with a specified vector
emanating from a location.

@param options
Additional options for processing this raycast query.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}

{@link minecraftcommon.UnsupportedFunctionalityError}
/

### `getLightLevel`
```ts
getLightLevel(location: Vector3): number;
```

@remarks
Returns the total brightness level of light shining on a
certain block position.

@param location
Location of the block we want to check the brightness of.
@returns
The brightness level on the block.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `getPlayers`
```ts
getPlayers(options?: EntityQueryOptions): Player[];
```

@remarks
Returns a set of players based on a set of conditions
defined via the EntityQueryOptions set of filter criteria.

@param options
Additional options that can be used to filter the set of
players returned.
@returns
A player array.
@throws This function can throw errors.

{@link CommandError}

{@link minecraftcommon.InvalidArgumentError}
/

### `getSkyLightLevel`
```ts
getSkyLightLevel(location: Vector3): number;
```

@remarks
Returns the brightness level of light shining from the sky
on a certain block position.

@param location
Position of the block we want to check the brightness of.
@returns
The brightness level on the block.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `getTopmostBlock`
```ts
getTopmostBlock(locationXZ: VectorXZ, minHeight?: number): Block | undefined;
```

@remarks
Returns the highest block at the given XZ location.

@param locationXZ
Location to retrieve the topmost block for.
@param minHeight
The Y height to begin the search from. Defaults to the
maximum dimension height.
@throws This function can throw errors.
/

### `isChunkLoaded`
```ts
isChunkLoaded(location: Vector3): boolean;
```

@remarks
Returns true if the chunk at the given location is loaded
(and valid for use with scripting).

@param location
Location to check if the chunk is loaded.
/

### `placeFeature`
```ts
placeFeature(featureName: string, location: Vector3, shouldThrow?: boolean): boolean;
```

@remarks
Places the given feature into the dimension at the specified
location.

This function can't be called in restricted-execution mode.

@param featureName
The string identifier for the feature.
@param location
Location to place the feature.
@param shouldThrow
Specifies if the function call will throw an error if the
feature could not be placed.
Note: The function call will always throw an error if using
an unknown feature name or trying to place in a unloaded
chunk.
Defaults to: false
@throws
An error will be thrown if the feature name is invalid.
An error will be thrown if the location is in an unloaded
chunk.

{@link Error}

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `placeFeatureRule`
```ts
placeFeatureRule(featureRuleName: string, location: Vector3): boolean;
```

@remarks
Places the given feature rule into the dimension at the
specified location.

This function can't be called in restricted-execution mode.

@param featureRuleName
The string identifier for the feature rule.
@param location
Location to place the feature rule.
@throws
An error will be thrown if the feature rule name is invalid.
An error will be thrown if the location is in an unloaded
chunk.

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `playSound`
```ts
playSound(soundId: string, location: Vector3, soundOptions?: WorldSoundOptions): SoundInstance;
```

@remarks
Plays a sound for all players.

This function can't be called in restricted-execution mode.

@param soundId
Identifier of the sound.
@param location
Location of the sound.
@param soundOptions
Additional options for configuring additional effects for
the sound.
@throws
An error will be thrown if volume is less than 0.0.
An error will be thrown if fade is less than 0.0.
An error will be thrown if pitch is less than 0.01.
An error will be thrown if volume is less than 0.0.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.PropertyOutOfBoundsError}
/

### `runCommand`
```ts
runCommand(commandString: string): CommandResult;
```

@remarks
Runs a command synchronously using the context of the
broader dimenion.

This function can't be called in restricted-execution mode.

@param commandString
Command to run. Note that command strings should not start
with slash.
@returns
Returns a command result with a count of successful values
from the command.
@throws
Throws an exception if the command fails due to incorrect
parameters or command syntax, or in erroneous cases for the
command. Note that in many cases, if the command does not
operate (e.g., a target selector found no matches), this
method will not throw an exception.

{@link CommandError}
/

### `setBlockPermutation`
```ts
setBlockPermutation(location: Vector3, permutation: BlockPermutation): void;
```

@remarks
Sets a block in the world using a BlockPermutation.
BlockPermutations are blocks with a particular state.

This function can't be called in restricted-execution mode.

@param location
The location within the dimension to set the block.
@param permutation
The block permutation to set.
@throws
Throws if the location is within an unloaded chunk or
outside of the world bounds.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `setBlockType`
```ts
setBlockType(location: Vector3, blockType: BlockType | string): void;
```

@remarks
Sets a block at a given location within the dimension.

This function can't be called in restricted-execution mode.

@param location
The location within the dimension to set the block.
@param blockType
The type of block to set. This can be either a string
identifier or a BlockType. The default block permutation is
used.
@throws
Throws if the location is within an unloaded chunk or
outside of the world bounds.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `setWeather`
```ts
setWeather(weatherType: WeatherType, duration?: number): void;
```

@remarks
Sets the current weather within the dimension

This function can't be called in restricted-execution mode.

@param weatherType
Set the type of weather to apply.
@param duration
Sets the duration of the weather (in ticks). If no duration
is provided, the duration will be set to a random duration
between 300 and 900 seconds.
Bounds: [1, 1000000]
@throws This function can throw errors.
/

### `spawnEntity`
```ts
spawnEntity(identifier: EntityType | string, location: Vector3, options?: SpawnEntityOptions): Entity;
```

@remarks
Creates a new entity (e.g., a mob) at the specified
location.

This function can't be called in restricted-execution mode.

@param identifier
Identifier of the type of entity to spawn. If no namespace
is specified, 'minecraft:' is assumed.
@param location
The location at which to create the entity.
@returns
Newly created entity at the specified location.
@throws This function can throw errors.

{@link EntitySpawnError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example spawnAdultHorse.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function spawnAdultHorse(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  log('Create a horse and triggering the ageable_grow_up event, ensuring the horse is created as an adult');
  targetLocation.dimension.spawnEntity(
    'minecraft:horse<minecraft:ageable_grow_up>',
    Vector3Utils.add(targetLocation, { x: 0, y: 1, z: 0 })
  );
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

### `spawnItem`
```ts
spawnItem(itemStack: ItemStack, location: Vector3): Entity;
```

@remarks
Creates a new item stack as an entity at the specified
location.

This function can't be called in restricted-execution mode.

@param location
The location at which to create the item stack.
@returns
Newly created item stack entity at the specified location.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example itemStacks.ts
```typescript
import { ItemStack, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function itemStacks(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1 };
  const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1 };
  const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4 };

  const oneEmerald = new ItemStack(MinecraftItemTypes.Emerald, 1);
  const onePickaxe = new ItemStack(MinecraftItemTypes.DiamondPickaxe, 1);
  const fiveEmeralds = new ItemStack(MinecraftItemTypes.Emerald, 5);

  log(`Spawning an emerald at (${oneItemLoc.x}, ${oneItemLoc.y}, ${oneItemLoc.z})`);
  targetLocation.dimension.spawnItem(oneEmerald, oneItemLoc);

  log(`Spawning five emeralds at (${fiveItemsLoc.x}, ${fiveItemsLoc.y}, ${fiveItemsLoc.z})`);
  targetLocation.dimension.spawnItem(fiveEmeralds, fiveItemsLoc);

  log(`Spawning a diamond pickaxe at (${diamondPickaxeLoc.x}, ${diamondPickaxeLoc.y}, ${diamondPickaxeLoc.z})`);
  targetLocation.dimension.spawnItem(onePickaxe, diamondPickaxeLoc);
}
```
@example spawnFeatherItem.ts
```typescript
import { ItemStack, DimensionLocation } from '@minecraft/server';
import { MinecraftItemTypes } from '@minecraft/vanilla-data';

function spawnFeatherItem(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const featherItem = new ItemStack(MinecraftItemTypes.Feather, 1);

  targetLocation.dimension.spawnItem(featherItem, targetLocation);
  log(`New feather created at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}!`);
}
```
/

### `spawnParticle`
```ts
spawnParticle(effectName: string, location: Vector3, molangVariables?: MolangVariableMap): void;
```

@remarks
Creates a new particle emitter at a specified location in
the world.

This function can't be called in restricted-execution mode.

@param effectName
Identifier of the particle to create.
@param location
The location at which to create the particle emitter.
@param molangVariables
A set of optional, customizable variables that can be
adjusted for this particle.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example spawnParticle.ts
```typescript
import { MolangVariableMap, DimensionLocation } from '@minecraft/server';

function spawnParticle(targetLocation: DimensionLocation) {
  for (let i = 0; i < 100; i++) {
    const molang = new MolangVariableMap();

    molang.setColorRGB('variable.color', { red: Math.random(), green: Math.random(), blue: Math.random() });

    const newLocation = {
      x: targetLocation.x + Math.floor(Math.random() * 8) - 4,
      y: targetLocation.y + Math.floor(Math.random() * 8) - 4,
      z: targetLocation.z + Math.floor(Math.random() * 8) - 4,
    };
    targetLocation.dimension.spawnParticle('minecraft:colored_flame_particle', newLocation, molang);
  }
}
```
/
