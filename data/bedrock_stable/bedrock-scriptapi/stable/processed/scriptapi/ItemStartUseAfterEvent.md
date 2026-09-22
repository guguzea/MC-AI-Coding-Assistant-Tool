> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.378Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemStartUseAfterEvent (class)

```ts
export class ItemStartUseAfterEvent {
```

Contains information related to a chargeable item starting
to be charged.

## Members（4）

### `private`
```ts
private constructor();
```

### `itemStack`
```ts
readonly itemStack: ItemStack;
```

@remarks
The impacted item stack that is starting to be charged.

/

### `source`
```ts
readonly source: Player;
```

@remarks
Returns the source entity that triggered this item event.

/

### `useDuration`
```ts
readonly useDuration: number;
```

@remarks
Returns the time, in ticks, for the remaining duration left
before the charge completes its cycle.

/
