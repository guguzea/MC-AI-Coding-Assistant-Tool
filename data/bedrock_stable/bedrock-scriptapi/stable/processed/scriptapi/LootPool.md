> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.421Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootPool (class)

```ts
export class LootPool {
```

A collection of entries which individually determine loot
drops. Can contain values determining drop outcomes,
including rolls, bonus rolls and tiers.

## Members（5）

### `private`
```ts
private constructor();
```

### `bonusRolls`
```ts
readonly bonusRolls: minecraftcommon.NumberRange;
readonly conditions: LootItemCondition[];
```

@remarks
Returns the number of extra times a loot pool will be rolled
based on the player's luck level, represented as a range
from minimum to maximum rolls.

/

### `entries`
```ts
readonly entries: LootPoolEntry[];
```

@remarks
Gets a complete list of all loot pool entries contained in
the loot pool.

/

### `rolls`
```ts
readonly rolls: minecraftcommon.NumberRange;
```

@remarks
Returns the number of times a loot pool will be rolled,
represented as a range from minimum to maximum rolls.

/

### `tiers`
```ts
readonly tiers?: LootPoolTiers;
```

@remarks
Gets the loot pool tier values for a given table if they
exist.

/
