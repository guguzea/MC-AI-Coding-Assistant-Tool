> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.362Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemComponentMineBlockEvent (class)

```ts
export class ItemComponentMineBlockEvent {
```

Contains information regarding the mining of a block using
an item.

## Members（5）

### `private`
```ts
private constructor();
```

### `block`
```ts
readonly block: Block;
```

@remarks
The block impacted by this event.

/

### `itemStack`
```ts
readonly itemStack?: ItemStack;
```

@remarks
The item stack used to mine the block.

/

### `minedBlockPermutation`
```ts
readonly minedBlockPermutation: BlockPermutation;
```

@remarks
The block permutation that was mined.

/

### `source`
```ts
readonly source: Entity;
```

@remarks
The entity that mined the block.

/
