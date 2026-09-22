> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.233Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityDefinitionFeedItem (class)

```ts
export class EntityDefinitionFeedItem {
```

As part of the Ageable component, represents a set of items
that can be fed to an entity and the rate at which that
causes them to grow.

## Members（4）

### `private`
```ts
private constructor();
```

### `growth`
```ts
readonly growth: number;
```

@remarks
The amount by which an entity's age will increase when fed
this item. Values usually range between 0 and 1.

/

### `item`
```ts
readonly item: string;
```

@remarks
Identifier of type of item that can be fed. If a namespace
is not specified, 'minecraft:' is assumed. Example values
include 'wheat' or 'golden_apple'.

/

### `resultItem`
```ts
readonly resultItem?: string;
```

@remarks
Type ID of the resulting item after feeding has occurred.
This will usually be empty but is used for scenarios such as
feeding a Nautilus with a bucket of fish, where the result
item will be an empty bucket.

/
