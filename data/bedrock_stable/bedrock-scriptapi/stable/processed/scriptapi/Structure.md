> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.564Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Structure (class)

```ts
export class Structure extends ISerializable {
```

## Members（9）

### `private`
```ts
private constructor();
```

### `id`
```ts
readonly id: string;
```

@remarks
The name of the structure. The identifier must include a
namespace. For structures created via the /structure command
or structure blocks, this namespace defaults to
"mystructure".

/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether the Structure is valid. The Structure may
become invalid if it is deleted.

/

### `size`
```ts
readonly size: Vector3;
```

@remarks
The dimensions of the structure. For example, a single block
structure will have a size of {x:1, y:1, z:1}

@throws This property can throw when used.

{@link InvalidStructureError}
/

### `getBlockPermutation`
```ts
getBlockPermutation(location: Vector3): BlockPermutation | undefined;
```

@remarks
Returns a BlockPermutation representing the block contained
within the Structure at the given location.

@param location
The block location relative to the Structure's origin.
@returns
Returns a BlockPermutation. Returns undefined if a block
does not exist at the given location.
@throws
Throws if the location is outside the structure's bounds.
Throws if the Structure has been deleted.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidStructureError}
/

### `getIsWaterlogged`
```ts
getIsWaterlogged(location: Vector3): boolean;
```

@remarks
Returns whether the block at the given location is
waterlogged.

@param location
The block location relative to the Structure's origin.
@returns
Returns whether the block at the given location is
waterlogged. Returns false if a block does not exist at the
given location.
@throws
Throws if the location is outside the structure's bounds.
Throws if the Structure has been deleted.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidStructureError}
/

### `saveAs`
```ts
saveAs(identifier: string, saveMode?: StructureSaveMode): Structure;
```

@remarks
Creates a copy of a Structure and saves it with a new name.

This function can't be called in restricted-execution mode.

@param identifier
The name of the newly created Structure.
@param saveMode
Determines how the Structure should be saved. Defaults to
saving to the world.
Defaults to: 1
@returns
Returns the newly created structure.
@throws
Throws if the identifier is invalid. A valid identifier must
include a namespace and must be unique.
Throws if the Structure has been deleted.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidStructureError}
/

### `saveToWorld`
```ts
saveToWorld(): void;
```

@remarks
Saves a modified Structure to the world file.

This function can't be called in restricted-execution mode.

@throws
Throws if the Structure has been deleted.

{@link InvalidStructureError}
/

### `setBlockPermutation`
```ts
setBlockPermutation(location: Vector3, blockPermutation?: BlockPermutation, waterlogged?: boolean): void;
```

@remarks
Sets a BlockPermutation within a Structure.

This function can't be called in restricted-execution mode.

@param location
The block location relative to the Structure's origin.
@param blockPermutation
The BlockPermutation to set.
Defaults to: null
@param waterlogged
Specifies whether the block should be waterlogged. Air and
undefined blocks cannot be waterlogged.
Defaults to: false
@throws
Throws if the type of block is StructureVoid.
Throws if the block is undefined and waterlogged is set to
true.
Throws if the block is air and waterlogged is set to true.
Throws if the location is outside the structure's bounds.
Throws if the Structure has been deleted.

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidStructureError}
/
