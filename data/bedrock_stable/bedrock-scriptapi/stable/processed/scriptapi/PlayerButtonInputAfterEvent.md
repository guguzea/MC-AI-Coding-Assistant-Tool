> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.440Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerButtonInputAfterEvent (class)

```ts
export class PlayerButtonInputAfterEvent {
```

Event data for when a player presses a button.

## Members（4）

### `private`
```ts
private constructor();
```

### `button`
```ts
readonly button: InputButton;
```

@remarks
The button this event is about.

/

### `newButtonState`
```ts
readonly newButtonState: ButtonState;
```

@remarks
The state that this button transferred to.

/

### `player`
```ts
readonly player: Player;
```

@remarks
The player that performed the input event.

/
