> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.333Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityTypes (class)

```ts
export class EntityTypes {
```

Used for accessing all entity types currently available for
use within the world.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(identifier: string): EntityType | undefined;
```

@remarks
Retrieves an entity type using a string-based identifier.

/

### `getAll`
```ts
static getAll(): EntityType[];
```

@remarks
Retrieves a set of all entity types within this world.

/
