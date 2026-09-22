> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.318Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityRemoveAfterEventSignal (class)

```ts
export class EntityRemoveAfterEventSignal {
```

Allows registration for an event that fires when an entity
is removed from  the game (for example, unloaded, or a few
seconds after they are dead.)

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(
  callback: (arg0: EntityRemoveAfterEvent) => void,
  options?: EntityEventOptions,
): (arg0: EntityRemoveAfterEvent) => void;
```

@remarks
Will call your function every time an entity is removed from
the game.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
Function to call.
@param options
Additional filtering options for this event.
@returns
Returns a closure that can be used in subsequent unsubscribe
operations.
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: EntityRemoveAfterEvent) => void): void;
```

@remarks
Unsubscribes your function from subsequent calls when an
entity is removed.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
