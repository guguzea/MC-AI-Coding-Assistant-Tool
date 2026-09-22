> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.664Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityItemDropEventOptions (interface)

```ts
export interface EntityItemDropEventOptions {
```

An interface that is passed into {@link
EntityItemDropAfterEventSignal.subscribe} that filters out
which events are passed to the provided callback.

## Members（2）

### `entityFilter`
```ts
entityFilter?: EntityFilter;
```

@remarks
If this value is set, this event will only fire for entities
that match.

/

### `itemFilter`
```ts
itemFilter?: ItemFilter;
```

@remarks
If this value is set, this event will only fire if an item
in the event matches.

/
