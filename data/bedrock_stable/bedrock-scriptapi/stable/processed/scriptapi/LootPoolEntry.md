> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.422Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootPoolEntry (class)

```ts
export class LootPoolEntry {
```

Represents one entry within Loot Table, which describes one
possible drop when a loot drop occurs. Can contain an item,
another loot table, a path to another loot table, or an
empty drop.

## Members（4）

### `private`
```ts
private constructor();
```

### `quality`
```ts
readonly quality: number;
```

@remarks
Gets the quality of a given loot pool entry.

/

### `subTable`
```ts
readonly subTable?: LootPoolEntry;
```

@remarks
Gets the subtable of a given loot pool entry.

/

### `weight`
```ts
readonly weight: number;
```

@remarks
Gets the weight of a given loot pool entry.

/
