> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.370Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemDurabilityComponent (class)

```ts
export class ItemDurabilityComponent extends ItemComponent {
```

## Members（6）

### `private`
```ts
private constructor();
```

### `damage`
```ts
damage: number;
```

@remarks
Returns the current damage level of this particular item.

This property can't be edited in restricted-execution mode.

/

### `maxDurability`
```ts
readonly maxDurability: number;
```

@remarks
Represents the amount of damage that this item can take
before breaking.

@throws This property can throw when used.
/

### `unbreakable`
```ts
unbreakable: boolean;
static readonly componentId = 'minecraft:durability';
```

@remarks
Whether an item breaks or loses durability. Setting to true
temporarily removes item's durability HUD, and freezes
durability loss on item.

This property can't be edited in restricted-execution mode.

/

### `getDamageChance`
```ts
getDamageChance(unbreakingEnchantmentLevel?: number): number;
```

@remarks
Returns the maximum chance that this item would be damaged
using the damageRange property, given an unbreaking
enchantment level.

This function can't be called in restricted-execution mode.

@param unbreakingEnchantmentLevel
Unbreaking factor to consider in factoring the damage
chance. Incoming unbreaking parameter must be within the
range [0, 3].
Defaults to: 0
Bounds: [0, 3]
@throws This function can throw errors.
/

### `getDamageChanceRange`
```ts
getDamageChanceRange(): minecraftcommon.NumberRange;
```

@remarks
A range of numbers that is used to calculate the damage
chance for an item. The damage chance will fall within this
range.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
