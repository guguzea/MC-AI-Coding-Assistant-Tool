> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.604Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockRaycastHit (interface)

```ts
export interface BlockRaycastHit {
```

Contains information for block raycast hit results.

## Members（3）

### `block`
```ts
block: Block;
```

@remarks
Block that was hit.

/

### `face`
```ts
face: Direction;
```

@remarks
Face of the block that was hit.

/

### `faceLocation`
```ts
faceLocation: Vector3;
```

@remarks
Hit location relative to the bottom north-west corner of the
block.

/
