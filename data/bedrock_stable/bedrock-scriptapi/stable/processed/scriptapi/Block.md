> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.141Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Block (class)

```ts
export class Block {
```

Represents a block in a dimension. A block represents a
unique X, Y, and Z within a dimension and get/sets the state
of the block at that location. This type was significantly
updated in version 1.17.10.21.

## Members（42）

### `private`
```ts
private constructor();
```

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
Returns the dimension that the block is within.

/

### `isAir`
```ts
readonly isAir: boolean;
```

@remarks
Returns true if this block is an air block (i.e., empty
space).

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `isLiquid`
```ts
readonly isLiquid: boolean;
```

@remarks
Returns true if this block is a liquid block - (e.g., a
water block and a lava block are liquid, while an air block
and a stone block are not. Water logged blocks are not
liquid blocks).

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns true if this reference to a block is still valid
(for example, if the block is unloaded, references to that
block will no longer be valid.)

/

### `isWaterlogged`
```ts
readonly isWaterlogged: boolean;
```

@remarks
Returns or sets whether this block has water on it.

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of this block's name used in .lang
files.

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `location`
```ts
readonly location: Vector3;
```

@remarks
Coordinates of the specified block.

@throws This property can throw when used.
/

### `permutation`
```ts
readonly permutation: BlockPermutation;
```

@remarks
Additional block configuration data that describes the
block.

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `readonly`
```ts
readonly 'type': BlockType;
```

@remarks
Gets the type of block.

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Identifier of the type of block for this block. Warning:
Vanilla block names can be changed in future releases, try
using 'Block.matches' instead for block comparison.

@throws This property can throw when used.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `x`
```ts
readonly x: number;
```

@remarks
X coordinate of the block.

/

### `y`
```ts
readonly y: number;
```

@remarks
Y coordinate of the block.

/

### `z`
```ts
readonly z: number;
```

@remarks
Z coordinate of the block.

/

### `above`
```ts
above(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} above this block (positive in the
Y direction).

@param steps
Number of steps above to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `below`
```ts
below(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} below this block (negative in the
Y direction).

@param steps
Number of steps below to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `bottomCenter`
```ts
bottomCenter(): Vector3;
```

@remarks
Returns the {@link Vector3} of the center of this block on
the X and Z axis.

/

### `canBeDestroyedByLiquidSpread`
```ts
canBeDestroyedByLiquidSpread(liquidType: LiquidType): boolean;
```

@remarks
Returns whether this block is removed when touched by
liquid.

@param liquidType
The type of liquid this function should be called for.
@returns
Whether this block is removed when touched by liquid.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `canContainLiquid`
```ts
canContainLiquid(liquidType: LiquidType): boolean;
```

@remarks
Returns whether this block can have a liquid placed over it,
i.e. be waterlogged.

@param liquidType
The type of liquid this function should be called for.
@returns
Whether this block can have a liquid placed over it.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `center`
```ts
center(): Vector3;
```

@remarks
Returns the {@link Vector3} of the center of this block on
the X, Y, and Z axis.

/

### `east`
```ts
east(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} to the east of this block
(positive in the X direction).

@param steps
Number of steps to the east to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getComponent`
```ts
getComponent<T extends string>(componentId: T): BlockComponentReturnType<T> | undefined;
```

@remarks
Gets a component (that represents additional capabilities)
for a block - for example, an inventory component of a chest
block.

@param componentId
The identifier of the component (e.g.,
'minecraft:inventory'). If no namespace prefix is specified,
'minecraft:' is assumed. Available component IDs are those
in the {@link BlockComponentTypes} enum and custom component
IDs registered with the {@link BlockComponentRegistry}.
@returns
Returns the component if it exists on the block, otherwise
undefined.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getComponents`
```ts
getComponents(): BlockComponent[];
```

@remarks
Returns all scripting components that are present on this
block.

@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getItemStack`
```ts
getItemStack(amount?: number, withData?: boolean): ItemStack | undefined;
```

@remarks
Creates a prototype item stack based on this block that can
be used with Container/ContainerSlot APIs.

@param amount
Number of instances of this block to place in the item
stack.
Defaults to: 1
Bounds: [1, 255]
@param withData
Whether additional data facets of the item stack are
included.
Defaults to: false
@returns
An itemStack with the specified amount of items and data.
Returns undefined if block type is incompatible.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getLightLevel`
```ts
getLightLevel(): number;
```

@remarks
Returns the total brightness level of light shining on a
certain block.

This function can't be called in restricted-execution mode.

@returns
The brightness level on the block.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `getParts`
```ts
getParts(): Block[] | undefined;
```

@remarks
Returns array of all loaded block parts if this block has
the 'minecraft:multi_block' trait. If it does not have the
trait returns undefined

@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getRedstonePower`
```ts
getRedstonePower(): number | undefined;
```

@remarks
Returns the net redstone power of this block.

@returns
Returns undefined if redstone power is not applicable to
this block.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `getSkyLightLevel`
```ts
getSkyLightLevel(): number;
```

@remarks
Returns the brightness level of light shining from the sky
on a certain block.

This function can't be called in restricted-execution mode.

@returns
The brightness level on the block.
@throws This function can throw errors.

{@link minecraftcommon.InvalidArgumentError}

{@link LocationInUnloadedChunkError}
/

### `getTags`
```ts
getTags(): string[];
```

@remarks
Returns a set of tags for a block.

@returns
The list of tags that the block has.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `hasComponent`
```ts
hasComponent(componentId: string): boolean;
```

@remarks
Returns true if the specified component is present on this
block.

@param componentId
The identifier of the component (e.g.,
'minecraft:inventory') to retrieve. If no namespace prefix
is specified, 'minecraft:' is assumed.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `hasTag`
```ts
hasTag(tag: string): boolean;
```

@remarks
Checks to see if the permutation of this block has a
specific tag.

@param tag
Tag to check for.
@returns
Returns `true` if the permutation of this block has the tag,
else `false`.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example checkBlockTags.ts
```typescript
import { DimensionLocation } from '@minecraft/server';

function checkBlockTags(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // Fetch the block
  const block = targetLocation.dimension.getBlock(targetLocation);

  // check that the block is loaded
  if (block) {
    log(`Block is dirt: ${block.hasTag('dirt')}`);
    log(`Block is wood: ${block.hasTag('wood')}`);
    log(`Block is stone: ${block.hasTag('stone')}`);
  }
}
```
/

### `isLiquidBlocking`
```ts
isLiquidBlocking(liquidType: LiquidType): boolean;
```

@remarks
Returns whether this block stops liquid from flowing.

@param liquidType
The type of liquid this function should be called for.
@returns
Whether this block stops liquid from flowing.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `liquidCanFlowFromDirection`
```ts
liquidCanFlowFromDirection(liquidType: LiquidType, flowDirection: Direction): boolean;
```

@remarks
Returns whether liquid can flow into the block from the
provided direction, or flow out from the provided direction
when liquid is placed into it with a bucket.

@param liquidType
The type of liquid this function should be called for.
@returns
Whether liquid can flow into the block from the provided
direction, or flow out from the provided direction when
liquid is placed into it with a bucket
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `liquidSpreadCausesSpawn`
```ts
liquidSpreadCausesSpawn(liquidType: LiquidType): boolean;
```

@remarks
Returns whether this block is removed and spawns its item
when touched by liquid.

@param liquidType
The type of liquid this function should be called for.
@returns
Whether this block is removed and spawns its item when
touched by liquid.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `matches`
```ts
matches(blockName: string, states?: Record<string, boolean | number | string>): boolean;
```

@remarks
Tests whether this block matches a specific criteria.

@param blockName
Block type identifier to match this API against.
@param states
Optional set of block states to test this block against.
@returns
Returns true if the block matches the specified criteria.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `north`
```ts
north(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} to the north of this block
(negative in the Z direction).

@param steps
Number of steps to the north to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `offset`
```ts
offset(offset: Vector3): Block | undefined;
```

@remarks
Returns a block at an offset relative vector to this block.

@param offset
The offset vector. For example, an offset of 0, 1, 0 will
return the block above the current block.
@returns
Block at the specified offset, or undefined if that block
could not be retrieved (for example, the block and its
relative chunk is not loaded yet.)
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `setPermutation`
```ts
setPermutation(permutation: BlockPermutation): void;
```

@remarks
Sets the block in the dimension to the state of the
permutation.

This function can't be called in restricted-execution mode.

@param permutation
Permutation that contains a set of property states for the
Block.
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `setType`
```ts
setType(blockType: BlockType | string): void;
```

@remarks
Sets the type of block.

This function can't be called in restricted-execution mode.

@param blockType
Identifier of the type of block to apply - for example,
minecraft:powered_repeater.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `setWaterlogged`
```ts
setWaterlogged(isWaterlogged: boolean): void;
```

@remarks
Sets whether this block has a water logged state - for
example, whether stairs are submerged within water.

This function can't be called in restricted-execution mode.

@param isWaterlogged
true if the block should have water within it.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `south`
```ts
south(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} to the south of this block
(positive in the Z direction).

@param steps
Number of steps to the south to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `west`
```ts
west(steps?: number): Block | undefined;
```

@remarks
Returns the {@link Block} to the west of this block
(negative in the X direction).

@param steps
Number of steps to the west to step before returning.
Defaults to: 1
@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/
