> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.368Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemCooldownComponent (class)

```ts
export class ItemCooldownComponent extends ItemComponent {
```

## Members（6）

### `private`
```ts
private constructor();
```

### `cooldownCategory`
```ts
readonly cooldownCategory: string;
```

@remarks
Represents the cooldown category that this item is
associated with.

@throws This property can throw when used.
/

### `cooldownTicks`
```ts
readonly cooldownTicks: number;
static readonly componentId = 'minecraft:cooldown';
```

@remarks
Amount of time, in ticks, it will take this item to
cooldown.

@throws This property can throw when used.
/

### `getCooldownTicksRemaining`
```ts
getCooldownTicksRemaining(player: Player): number;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `isCooldownCategory`
```ts
isCooldownCategory(cooldownCategory: string): boolean;
```

@remarks
Will return true if the item is the cooldown category passed
in and false otherwise.

This function can't be called in restricted-execution mode.

@param cooldownCategory
The cooldown category that might be associated with this
item.
@returns
True if the item is the given cooldown category.
@throws This function can throw errors.
/

### `startCooldown`
```ts
startCooldown(player: Player): void;
```

@remarks
Starts a new cooldown period for this item.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
