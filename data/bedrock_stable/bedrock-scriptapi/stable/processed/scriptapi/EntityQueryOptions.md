> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.666Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityQueryOptions (interface)

```ts
export interface EntityQueryOptions extends EntityFilter {
```

## Members（6）

### `closest`
```ts
closest?: number;
```

@remarks
Limits the number of entities to return, opting for the
closest N entities as specified by this property. The
location value must also be specified on the query options
object.

/

### `farthest`
```ts
farthest?: number;
```

@remarks
Limits the number of entities to return, opting for the
farthest N entities as specified by this property. The
location value must also be specified on the query options
object.

/

### `location`
```ts
location?: Vector3;
```

@remarks
Adds a seed location to the query that is used in
conjunction with closest, farthest, limit, volume, and
distance properties.

/

### `maxDistance`
```ts
maxDistance?: number;
```

@remarks
If specified, includes entities that are less than this
distance away from the location specified in the location
property.

/

### `minDistance`
```ts
minDistance?: number;
```

@remarks
If specified, includes entities that are least this distance
away from the location specified in the location property.

/

### `volume`
```ts
volume?: Vector3;
```

@remarks
In conjunction with location, specified a cuboid volume of
entities to include.

/
