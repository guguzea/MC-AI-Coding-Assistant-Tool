> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.252Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityHealBeforeEventSignal (class)

```ts
export class EntityHealBeforeEventSignal {
```

Manages callbacks that are connected to when an entity will
be healed.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(
  callback: (arg0: EntityHealBeforeEvent) => void,
  options?: EntityHealEventOptions,
): (arg0: EntityHealBeforeEvent) => void;
```

@remarks
Adds a callback that will be called when an entity will be
healed.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
This closure is called with restricted-execution privilege.
@returns
Closure that is called with restricted-execution privilege.
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: EntityHealBeforeEvent) => void): void;
```

@remarks
Removes a callback from being called when an entity will be
healed.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
This closure is called with restricted-execution privilege.
/
