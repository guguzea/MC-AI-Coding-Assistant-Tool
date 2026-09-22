> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.410Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LeverActionAfterEvent (class)

```ts
export class LeverActionAfterEvent extends BlockEvent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `isPowered`
```ts
readonly isPowered: boolean;
```

@remarks
True if the lever is activated (that is, transmitting
power).

/

### `player`
```ts
readonly player: Player;
```

@remarks
Optional player that triggered the lever activation.

/
