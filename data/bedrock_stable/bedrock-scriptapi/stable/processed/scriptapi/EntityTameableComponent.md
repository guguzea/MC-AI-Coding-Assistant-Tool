> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.329Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityTameableComponent (class)

```ts
export class EntityTameableComponent extends EntityComponent {
```

## Members（7）

### `private`
```ts
private constructor();
```

### `getTameItems`
```ts
readonly getTameItems: ItemStack[];
```

@remarks
Returns a set of items that can be used to tame this entity.

@throws This property can throw when used.
/

### `isTamed`
```ts
readonly isTamed: boolean;
```

@remarks
Returns true if the entity is tamed by player.

@throws This property can throw when used.
/

### `probability`
```ts
readonly probability: number;
```

@remarks
The chance of taming the entity with each item use between
0.0 and 1.0, where 1.0 is 100%

@throws This property can throw when used.
/

### `tamedToPlayer`
```ts
readonly tamedToPlayer?: Player;
```

@remarks
Returns the player that has tamed the entity, or 'undefined'
if entity is not tamed.

@throws This property can throw when used.
/

### `tamedToPlayerId`
```ts
readonly tamedToPlayerId?: string;
static readonly componentId = 'minecraft:tameable';
```

@remarks
Returns the id of player that has tamed the entity, or
'undefined' if entity is not tamed.

@throws This property can throw when used.
/

### `tame`
```ts
tame(player: Player): boolean;
```

@remarks
Set this entity as tamed by the given player.

This function can't be called in restricted-execution mode.

@param player
The player that this entity should be tamed by.
@returns
Returns true if the entity was tamed.
@throws This function can throw errors.
/
