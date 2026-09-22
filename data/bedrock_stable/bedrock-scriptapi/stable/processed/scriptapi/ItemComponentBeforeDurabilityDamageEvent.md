> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.359Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemComponentBeforeDurabilityDamageEvent (class)

```ts
export class ItemComponentBeforeDurabilityDamageEvent {
```

Contains information regarding an item before it is damaged
from hitting an entity.

## Members（5）

### `private`
```ts
private constructor();
```

### `attackingEntity`
```ts
readonly attackingEntity: Entity;
```

@remarks
The attacking entity.

/

### `durabilityDamage`
```ts
durabilityDamage: number;
```

@remarks
The damage applied to the item's durability when the event
occurs.

/

### `hitEntity`
```ts
readonly hitEntity: Entity;
```

@remarks
The entity being hit.

/

### `itemStack`
```ts
itemStack?: ItemStack;
```

@remarks
The item stack used to hit the entity.

/
