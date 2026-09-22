> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.662Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityHurtAfterEventOptions (interface)

```ts
export interface EntityHurtAfterEventOptions {
```

Contains optional parameters for registering an entity hurt
after event.

## Members（4）

### `allowedDamageCauses`
```ts
allowedDamageCauses?: EntityDamageCause[];
```

@remarks
If this value is set, this event will only fire for damage
causes that match.

/

### `entities`
```ts
entities?: Entity[];
```

@remarks
If this value is set, this event will only fire for entities
that match the entities within this collection.

/

### `entityFilter`
```ts
entityFilter?: EntityFilter;
```

@remarks
If this value is set, this event will only fire for entities
that match.

/

### `entityTypes`
```ts
entityTypes?: string[];
```

@remarks
If this value is set, this event will only fire if the
impacted entities' type matches this parameter.

/
