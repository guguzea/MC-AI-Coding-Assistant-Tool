> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.703Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# SpawnEntityOptions (interface)

```ts
export interface SpawnEntityOptions {
```

Contains additional options for spawning an Entity.

## Members（3）

### `initialPersistence`
```ts
initialPersistence?: boolean;
```

@remarks
Optional boolean which determines if this entity should
persist in the game world. Persistence prevents the entity
from automatically despawning.

/

### `initialRotation`
```ts
initialRotation?: number;
```

@remarks
Optional initial rotation, in degrees, to set on the entity
when it spawns.

/

### `spawnEvent`
```ts
spawnEvent?: string;
```

@remarks
Optional spawn event to send to the entity after it is
spawned.

/
