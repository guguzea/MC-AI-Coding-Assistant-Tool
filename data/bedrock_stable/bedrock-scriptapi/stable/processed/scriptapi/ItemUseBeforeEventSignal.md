> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.390Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemUseBeforeEventSignal (class)

```ts
export class ItemUseBeforeEventSignal {
```

Manages callbacks that fire before an item is used.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(callback: (arg0: ItemUseBeforeEvent) => void): (arg0: ItemUseBeforeEvent) => void;
```

@remarks
Adds a callback that will be called before an item is used.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
This closure is called with restricted-execution privilege.
@returns
Closure that is called with restricted-execution privilege.
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: ItemUseBeforeEvent) => void): void;
```

@remarks
Removes a callback from being called before an item is used.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
This closure is called with restricted-execution privilege.
/
