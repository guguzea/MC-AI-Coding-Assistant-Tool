> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.708Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TickingArea (interface)

```ts
export interface TickingArea {
```

A context which provides information about a specific
ticking area.

## Members（5）

### `boundingBox`
```ts
boundingBox: BlockBoundingBox;
```

@remarks
The box which contains all the ticking blocks in the ticking
area.

/

### `chunkCount`
```ts
chunkCount: number;
```

@remarks
The number of chunks that the ticking area contains.

/

### `dimension`
```ts
dimension: Dimension;
```

@remarks
The dimension the ticking area is located.

/

### `identifier`
```ts
identifier: string;
```

@remarks
The unique identifier of the ticking area.

/

### `isFullyLoaded`
```ts
isFullyLoaded: boolean;
```

@remarks
Will be true if all the ticking areas chunks are loaded in
ticking and false otherwise.

/
