> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.254Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityHealthChangedAfterEvent (class)

```ts
export class EntityHealthChangedAfterEvent {
```

Contains information related to an entity when its health
changes. Warning: don't change the health of an entity in
this event, or it will cause an infinite loop!

## Members（4）

### `private`
```ts
private constructor();
```

### `entity`
```ts
readonly entity: Entity;
```

@remarks
Entity whose health changed.

/

### `newValue`
```ts
readonly newValue: number;
```

@remarks
New health value of the entity.

/

### `oldValue`
```ts
readonly oldValue: number;
```

@remarks
Old health value of the entity.

/
