> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.219Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityAgeableComponent (class)

```ts
export class EntityAgeableComponent extends EntityComponent {
```

## Members（6）

### `private`
```ts
private constructor();
```

### `duration`
```ts
readonly duration: number;
```

@remarks
Amount of time before the entity grows up, -1 for always a
baby.

@throws This property can throw when used.
/

### `growUp`
```ts
readonly growUp: Trigger;
```

@remarks
Event that runs when this entity grows up.

@throws This property can throw when used.
/

### `transformToItem`
```ts
readonly transformToItem: string;
static readonly componentId = 'minecraft:ageable';
```

@remarks
The feed item used will transform into this item upon
successful interaction.

@throws This property can throw when used.
/

### `getDropItems`
```ts
getDropItems(): string[];
```

@remarks
List of items that the entity drops when it grows up.

@throws This function can throw errors.
/

### `getFeedItems`
```ts
getFeedItems(): EntityDefinitionFeedItem[];
```

@remarks
List of items that can be fed to the entity. Includes 'item'
for the item name and 'growth' to define how much time it
grows up by.

@throws This function can throw errors.
/
