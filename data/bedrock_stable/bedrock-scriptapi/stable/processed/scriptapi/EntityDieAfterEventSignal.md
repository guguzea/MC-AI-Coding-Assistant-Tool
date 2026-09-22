> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.236Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityDieAfterEventSignal (class)

```ts
export class EntityDieAfterEventSignal {
```

Supports registering for an event that fires after an entity
has died.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(
  callback: (arg0: EntityDieAfterEvent) => void,
  options?: EntityEventOptions,
): (arg0: EntityDieAfterEvent) => void;
```

@remarks
Subscribes to an event that fires when an entity dies.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
Function to call when an entity dies.
@param options
Additional filtering options for when the subscription
fires.
@returns
Returns the closure that can be used in future downstream
calls to unsubscribe.
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: EntityDieAfterEvent) => void): void;
```

@remarks
Stops this event from calling your function when an entity
dies.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
