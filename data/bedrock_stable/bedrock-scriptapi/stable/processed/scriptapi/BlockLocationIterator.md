> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.168Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockLocationIterator (class)

```ts
export class BlockLocationIterator implements Iterable<Vector3> {
```

A BlockLocationIterator returns the next block location of
the block volume across which it is iterating.
The BlockLocationIterator is used to abstract the shape of
the block volume it was fetched from (so it can represent
all the block locations that make up rectangles, cubes,
spheres, lines and complex shapes).
Each iteration pass returns the next valid block location in
the parent shape.
Unless otherwise specified by the parent shape - the
BlockLocationIterator will iterate over a 3D space in the
order of increasing X, followed by increasing Z followed by
increasing Y.
(Effectively stepping across the XZ plane, and when all the
locations in that plane are exhausted, increasing the Y
coordinate to the next XZ slice)

## Members（3）

### `private`
```ts
private constructor();
```

### `[Symbol.iterator]`
```ts
[Symbol.iterator](): Iterator<Vector3>;
```

@remarks
This function can't be called in restricted-execution mode.

/

### `next`
```ts
next(): IteratorResult<Vector3>;
```

@remarks
This function can't be called in restricted-execution mode.

/
