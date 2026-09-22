> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.425Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootTable (class)

```ts
export class LootTable {
```

Represents a single Loot Table, which determines what items
are generated when killing a mob, breaking a block, filling
a container, and more.

## Members（3）

### `private`
```ts
private constructor();
```

### `path`
```ts
readonly path: string;
```

@remarks
Returns the path to the JSON file that represents this loot
table. Does not include file extension, or 'loot_tables/'
folder prefix. Example: `entities/creeper`.

/

### `pools`
```ts
readonly pools: LootPool[];
```

@remarks
Returns the array of loot pools on a given loot table.

/
