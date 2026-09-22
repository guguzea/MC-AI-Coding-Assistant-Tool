> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.514Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerSwingStartAfterEventSignal (class)

```ts
export class PlayerSwingStartAfterEventSignal {
```

Manages callbacks that are connected to when a player starts
to swing their arm (e.g. attacking, using an item,
interacting).

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(
  callback: (arg0: PlayerSwingStartAfterEvent) => void,
  options?: PlayerSwingEventOptions,
): (arg0: PlayerSwingStartAfterEvent) => void;
```

@remarks
Adds a callback that will be called when a player starts to
swing their arm (e.g. attacking, using an item,
interacting).

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: PlayerSwingStartAfterEvent) => void): void;
```

@remarks
Removes a callback from being called when a player starts to
swing their arm (e.g. attacking, using an item,
interacting).

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
