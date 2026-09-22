> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.533Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# RandomChanceWithLootingCondition (class)

```ts
export class RandomChanceWithLootingCondition extends LootItemCondition {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `chance`
```ts
readonly chance: number;
```

@remarks
The base chance, from 0.0-1.0, that loot will drop. Will be
modified by the 'lootingMultiplier' value.

/

### `lootingMultiplier`
```ts
readonly lootingMultiplier: number;
```

@remarks
The increase in drop chance per looting enchant level.

/
