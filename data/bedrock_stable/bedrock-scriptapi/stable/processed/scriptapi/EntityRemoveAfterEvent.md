> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.316Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityRemoveAfterEvent (class)

```ts
export class EntityRemoveAfterEvent {
```

Data for an event that happens when an entity is removed
from the world (for example, the entity is unloaded because
it is not close to players.)

## Members（3）

### `private`
```ts
private constructor();
```

### `removedEntityId`
```ts
readonly removedEntityId: string;
```

@remarks
Id of the entity that was removed.

/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Identifier of the type of the entity removed - for example,
'minecraft:skeleton'.

/
