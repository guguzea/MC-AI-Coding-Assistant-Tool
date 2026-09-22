> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.668Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityQueryScoreOptions (interface)

```ts
export interface EntityQueryScoreOptions {
```

Contains additional options for filtering players based on
their score for an objective.

## Members（4）

### `exclude`
```ts
exclude?: boolean;
```

@remarks
If set to true, entities and players within this score range
are excluded from query results.

/

### `maxScore`
```ts
maxScore?: number;
```

@remarks
If defined, only players that have a score equal to or under
maxScore are included.

/

### `minScore`
```ts
minScore?: number;
```

@remarks
If defined, only players that have a score equal to or over
minScore are included.

/

### `objective`
```ts
objective?: string;
```

@remarks
Identifier of the scoreboard objective to filter on.

/
