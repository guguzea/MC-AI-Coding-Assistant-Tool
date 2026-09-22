> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.568Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# SystemAfterEvents (class)

```ts
export class SystemAfterEvents {
```

Provides a set of events that fire within the broader
scripting system within Minecraft.

## Members（2）

### `private`
```ts
private constructor();
```

### `scriptEventReceive`
```ts
readonly scriptEventReceive: ScriptEventCommandMessageAfterEventSignal;
```

@remarks
An event that fires when a /scriptevent command is set. This
provides a way for commands and other systems to trigger
behavior within script.

This property can be read in early-execution mode.

/
