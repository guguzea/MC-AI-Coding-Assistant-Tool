> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.182Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockVolumeBase (class)

```ts
export class BlockVolumeBase {
```

Base type for BlockVolumes.

## Members（8）

### `private`
```ts
private constructor();
```

### `getBlockLocationIterator`
```ts
getBlockLocationIterator(): BlockLocationIterator;
```

@remarks
Fetch a {@link BlockLocationIterator} that represents all of
the block world locations within the specified volume

/

### `getCapacity`
```ts
getCapacity(): number;
```

@remarks
Return the capacity (volume) of the BlockVolume (W*D*H)

/

### `getMax`
```ts
getMax(): Vector3;
```

@remarks
Get the largest corner position of the volume (guaranteed to
be >= min)

@throws This function can throw errors.
/

### `getMin`
```ts
getMin(): Vector3;
```

@remarks
Get the smallest corner position of the volume (guaranteed
to be <= max)

@throws This function can throw errors.
/

### `getSpan`
```ts
getSpan(): Vector3;
```

@remarks
Get a {@link Vector3} object where each component represents
the number of blocks along that axis

/

### `isInside`
```ts
isInside(location: Vector3): boolean;
```

@remarks
Check to see if a given world block location is inside a
BlockVolume

/

### `translate`
```ts
translate(delta: Vector3): void;
```

@remarks
Move a BlockVolume by a specified amount

@param delta
Amount of blocks to move by
/
