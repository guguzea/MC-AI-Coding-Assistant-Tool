> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.171Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockPermutation (class)

```ts
export class BlockPermutation {
```

Contains the combination of type {@link BlockType} and
properties (also sometimes called block state) which
describe a block (but does not belong to a specific {@link
Block}).
@example addTranslatedSign.ts
```typescript
import { world, BlockPermutation, BlockSignComponent, BlockComponentTypes, DimensionLocation } from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

function addTranslatedSign(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log('Could not find a block at specified location.');
    return -1;
  }
  const signPerm = BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(BlockComponentTypes.Sign) as BlockSignComponent;

  signComponent?.setText({ translate: 'item.skull.player.name', with: [players[0].name] });
}
```

## Members（15）

### `private`
```ts
private constructor();
```

### `localizationKey`
```ts
readonly localizationKey: string;
```

@remarks
Key for the localization of this BlockPermutation's name
used in .lang files.

/

### `readonly`
```ts
readonly 'type': BlockType;
```

@remarks
The {@link BlockType} that the permutation has.

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
/

### `getAllStates`
```ts
getAllStates(): Record<string, boolean | number | string>;
```

@remarks
Returns all available block states associated with this
block.

@returns
Returns the list of all of the block states that the
permutation has.
/

### `getItemStack`
```ts
getItemStack(amount?: number): ItemStack | undefined;
```

@remarks
Retrieves a prototype item stack based on this block
permutation that can be used with item
Container/ContainerSlot APIs.

@param amount
Number of instances of this block to place in the prototype
item stack.
Defaults to: 1
Bounds: [1, 255]
/

### `getState`
```ts
getState<T extends keyof minecraftvanilladata.BlockStateSuperset>(
  stateName: T,
): minecraftvanilladata.BlockStateSuperset[T] | undefined;
```

@remarks
Gets a state for the permutation.

@param stateName
Name of the block state who's value is to be returned.
@returns
Returns the state if the permutation has it, else
`undefined`.
/

### `getTags`
```ts
getTags(): string[];
```

@remarks
Creates a copy of the permutation.

/

### `hasTag`
```ts
hasTag(tag: string): boolean;
```

@remarks
Checks to see if the permutation has a specific tag.

@returns
Returns `true` if the permutation has the tag, else `false`.
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
/

### `matches`
```ts
matches<T extends string = minecraftvanilladata.MinecraftBlockTypes>(
  blockName: T,
  states?: BlockStateArg<T>,
): boolean;
```

@remarks
Returns a boolean whether a specified permutation matches
this permutation. If states is not specified, matches checks
against the set of types more broadly.

@param blockName
An optional set of states to compare against.
/

### `withState`
```ts
withState<T extends keyof minecraftvanilladata.BlockStateSuperset>(
  name: T,
  value: minecraftvanilladata.BlockStateSuperset[T],
): BlockPermutation;
```

@remarks
Returns a derived BlockPermutation with a specific property
set.

@param name
Identifier of the block property.
@param value
Value of the block property.
@throws This function can throw errors.
/

### `resolve`
```ts
static resolve<T extends string = minecraftvanilladata.MinecraftBlockTypes>(
  blockName: T,
  states?: BlockStateArg<T>,
): BlockPermutation;
```

@remarks
Given a type identifier and an optional set of properties,
will return a BlockPermutation object that is usable in
other block APIs (e.g., block.setPermutation)

@param blockName
Identifier of the block to check.
@throws This function can throw errors.
@example addBlockColorCube.ts
```typescript
import { BlockPermutation, DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

function addBlockColorCube(targetLocation: DimensionLocation) {
  const allWoolBlocks: string[] = [
    MinecraftBlockTypes.WhiteWool,
    MinecraftBlockTypes.OrangeWool,
    MinecraftBlockTypes.MagentaWool,
    MinecraftBlockTypes.LightBlueWool,
    MinecraftBlockTypes.YellowWool,
    MinecraftBlockTypes.LimeWool,
    MinecraftBlockTypes.PinkWool,
    MinecraftBlockTypes.GrayWool,
    MinecraftBlockTypes.LightGrayWool,
    MinecraftBlockTypes.CyanWool,
    MinecraftBlockTypes.PurpleWool,
    MinecraftBlockTypes.BlueWool,
    MinecraftBlockTypes.BrownWool,
    MinecraftBlockTypes.GreenWool,
    MinecraftBlockTypes.RedWool,
    MinecraftBlockTypes.BlackWool,
  ];

  const cubeDim = 7;

  let colorIndex = 0;

  for (let x = 0; x <= cubeDim; x++) {
    for (let y = 0; y <= cubeDim; y++) {
      for (let z = 0; z <= cubeDim; z++) {
        colorIndex++;
        targetLocation.dimension
          .getBlock(Vector3Utils.add(targetLocation, { x, y, z }))
          ?.setPermutation(BlockPermutation.resolve(allWoolBlocks[colorIndex % allWoolBlocks.length]));
      }
    }
  }
}
```
/
