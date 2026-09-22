> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.251Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityHealBeforeEvent (class)

```ts
export class EntityHealBeforeEvent {
```

Contains information related to an entity that will be
healed.

## Members（4）

### `private`
```ts
private constructor();
cancel: boolean;
```

### `healedEntity`
```ts
readonly healedEntity: Entity;
```

@remarks
Entity that will be healed.

/

### `healing`
```ts
healing: number;
```

@remarks
Describes the amount of healing.

/

### `healSource`
```ts
readonly healSource: EntityHealSource;
```

@remarks
Information on the source of healing.

/
