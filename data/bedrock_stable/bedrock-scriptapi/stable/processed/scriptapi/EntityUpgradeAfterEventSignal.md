> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.336Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityUpgradeAfterEventSignal (class)

```ts
export class EntityUpgradeAfterEventSignal {
```

Contains event registration related to firing of a data
driven entity version upgrade.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(
  callback: (arg0: EntityUpgradeAfterEvent) => void,
  options?: EntityDataDrivenTriggerEventOptions,
): (arg0: EntityUpgradeAfterEvent) => void;
```

@remarks
Adds a callback that will be called after a data driven
entity version upgrade is triggered.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: EntityUpgradeAfterEvent) => void): void;
```

@remarks
Removes a callback that will be called after a data driven
entity version upgrade is triggered.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
