> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.424Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootPoolTiers (class)

```ts
export class LootPoolTiers {
```

Represents the values which determine loot drops in a tiered
loot pool. Potential drops from tiered loot pools are
ordered, and chosen via logic controlled by the values in
this object.

## Members（4）

### `private`
```ts
private constructor();
```

### `bonusChance`
```ts
readonly bonusChance: number;
```

@remarks
The chance for each bonus roll attempt to upgrade the tier
of the dropped item.

/

### `bonusRolls`
```ts
readonly bonusRolls: number;
```

@remarks
The number of attempts for the loot drop to upgrade its
tier, thereby incrementing its position in the loot pool
entry array, resulting in a higher tier drop.

/

### `initialRange`
```ts
readonly initialRange: number;
```

@remarks
Represents the upper bound for the starting point in
determining which tier of loot to drop. The lower bound is
always 1. For example, a value of 3 would result in the tier
drop logic starting at a randomly selected position in the
loot pool entry array between 1 and 3.

/
