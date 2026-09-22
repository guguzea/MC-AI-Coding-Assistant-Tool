> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.345Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# FeedItem (class)

```ts
export class FeedItem {
```

As part of the Healable component, represents a specific
item that can be fed to an entity to cause health effects.

## Members（5）

### `private`
```ts
private constructor();
```

### `healAmount`
```ts
readonly healAmount: number;
```

@remarks
The amount of health this entity gains when fed this item.
This number is an integer starting at 0. Sample values can
go as high as 40.

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

### `getEffects`
```ts
getEffects(): FeedItemEffect[];
```

@remarks
As part of the Healable component, an optional collection of
side effects that can occur from being fed an item.

/
