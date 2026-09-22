> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.218Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityAddRiderComponent (class)

```ts
export class EntityAddRiderComponent extends EntityComponent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `entityType`
```ts
readonly entityType: string;
```

@remarks
The type of entity that is added as a rider for this entity
when spawned under certain conditions.

@throws This property can throw when used.
/

### `spawnEvent`
```ts
readonly spawnEvent: string;
static readonly componentId = 'minecraft:addrider';
```

@remarks
Optional spawn event to trigger on the rider when that rider
is spawned for this entity.

@throws This property can throw when used.
/
