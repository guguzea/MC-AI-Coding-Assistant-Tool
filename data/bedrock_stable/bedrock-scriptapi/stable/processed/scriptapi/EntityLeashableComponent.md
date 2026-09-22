> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.293Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityLeashableComponent (class)

```ts
export class EntityLeashableComponent extends EntityComponent {
```

## Members（10）

### `private`
```ts
private constructor();
```

### `canBeStolen`
```ts
readonly canBeStolen: boolean;
```

@remarks
Returns true if another entity can 'steal' the leashed
entity by attaching their own leash to it.

@throws This property can throw when used.
/

### `hardDistance`
```ts
readonly hardDistance: number;
```

@remarks
Distance in blocks at which the leash stiffens, restricting
movement.

@throws This property can throw when used.
/

### `isLeashed`
```ts
readonly isLeashed: boolean;
```

@remarks
Returns true if the entity is leashed.

@throws This property can throw when used.
/

### `leashHolder`
```ts
readonly leashHolder?: Entity;
```

@remarks
Entity that is holding the leash.

@throws This property can throw when used.
/

### `leashHolderEntityId`
```ts
readonly leashHolderEntityId?: string;
```

@remarks
Identifier of entity that is holding the leash.

@throws This property can throw when used.
/

### `maxDistance`
```ts
readonly maxDistance: number;
```

@remarks
Distance in blocks at which the leash breaks.

@throws This property can throw when used.
/

### `softDistance`
```ts
readonly softDistance: number;
static readonly componentId = 'minecraft:leashable';
```

@remarks
Distance in blocks at which the 'spring' effect starts
acting to keep this entity close to the entity that leashed
it.

@throws This property can throw when used.
/

### `leashTo`
```ts
leashTo(leashHolder: Entity): void;
```

@remarks
Leashes this entity to another entity.

This function can't be called in restricted-execution mode.

@param leashHolder
The entity to leash this entity to.
@throws
Throws if the entity to leash to is over the max distance,
and if the player is dead or in spectator mode.
/

### `unleash`
```ts
unleash(): void;
```

@remarks
Unleashes this entity if it is leashed to another entity.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
