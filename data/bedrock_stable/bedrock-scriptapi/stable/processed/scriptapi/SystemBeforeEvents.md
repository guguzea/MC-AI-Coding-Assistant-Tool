> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.569Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# SystemBeforeEvents (class)

```ts
export class SystemBeforeEvents {
```

A set of events that fire before an actual action occurs. In
most cases, you can potentially cancel or modify the
impending event. Note that in before events any APIs that
modify gameplay state will not function and will throw an
error.

## Members（3）

### `private`
```ts
private constructor();
```

### `shutdown`
```ts
readonly shutdown: ShutdownBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `startup`
```ts
readonly startup: StartupBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/
