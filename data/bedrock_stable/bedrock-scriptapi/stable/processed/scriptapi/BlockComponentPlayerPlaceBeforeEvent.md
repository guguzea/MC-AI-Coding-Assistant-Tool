> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.150Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockComponentPlayerPlaceBeforeEvent (class)

```ts
export class BlockComponentPlayerPlaceBeforeEvent extends BlockEvent {
```

## Members（5）

### `private`
```ts
private constructor();
```

### `cancel`
```ts
cancel: boolean;
```

@remarks
If set to true, cancels the block place event.

/

### `face`
```ts
readonly face: Direction;
```

@remarks
The block face that was placed onto.

/

### `permutationToPlace`
```ts
permutationToPlace: BlockPermutation;
```

@remarks
The block permutation that will be placed if the event is
not cancelled. If set to a different block permutation, that
permutation will be placed instead.

/

### `player`
```ts
readonly player?: Player;
```

@remarks
The player that is placing this block.

/
