> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.659Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityFilter (interface)

```ts
export interface EntityFilter {
```

Contains options for filtering entities.

## Members（17）

### `excludeFamilies`
```ts
excludeFamilies?: string[];
```

@remarks
Excludes entities that match one or more of the specified
families.

/

### `excludeGameModes`
```ts
excludeGameModes?: GameMode[];
```

@remarks
Excludes entities if have a specific gamemode that matches
the specified gamemode.

/

### `excludeNames`
```ts
excludeNames?: string[];
```

@remarks
Excludes entities that have a name that match one of the
specified values.

/

### `excludeTags`
```ts
excludeTags?: string[];
```

@remarks
Excludes entities with a tag that matches one of the
specified values.

/

### `excludeTypes`
```ts
excludeTypes?: string[];
```

@remarks
Excludes entities if they are one of the specified types.

/

### `families`
```ts
families?: string[];
```

@remarks
If specified, includes entities that match all of the
specified families.

/

### `gameMode`
```ts
gameMode?: GameMode;
```

@remarks
If specified, includes entities with a gamemode that matches
the specified gamemode.

/

### `maxHorizontalRotation`
```ts
maxHorizontalRotation?: number;
```

@remarks
If specified, will only include entities that have at most
this horizontal rotation.

/

### `maxLevel`
```ts
maxLevel?: number;
```

@remarks
If defined, only players that have at most this level are
returned.

/

### `maxVerticalRotation`
```ts
maxVerticalRotation?: number;
```

@remarks
If specified, only entities that have at most this vertical
rotation are returned.

/

### `minHorizontalRotation`
```ts
minHorizontalRotation?: number;
```

@remarks
If specified, will only include entities that have at a
minimum this horizontal rotation.

/

### `minLevel`
```ts
minLevel?: number;
```

@remarks
If defined, only players that have at least this level are
returned.

/

### `minVerticalRotation`
```ts
minVerticalRotation?: number;
```

@remarks
If specified, will only include entities that have at least
this vertical rotation.

/

### `name`
```ts
name?: string;
propertyOptions?: EntityQueryPropertyOptions[];
```

@remarks
Includes entities with the specified name.

/

### `scoreOptions`
```ts
scoreOptions?: EntityQueryScoreOptions[];
```

@remarks
Gets/sets a collection of EntityQueryScoreOptions objects
with filters for specific scoreboard objectives.

/

### `tags`
```ts
tags?: string[];
```

@remarks
Includes entities that match all of the specified tags.

/

### `type`
```ts
type?: string;
```

@remarks
If defined, entities that match this type are included.

/
