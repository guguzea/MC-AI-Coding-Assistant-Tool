> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.693Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ProgressKeyFrame (interface)

```ts
export interface ProgressKeyFrame {
```

Key frame that holds the progress of the camera animation.

## Members（3）

### `alpha`
```ts
alpha: number;
```

@remarks
Value to denote how far along the curve the camera will be.
Values are [0.0, 1.0] inclusive.

/

### `easingFunc`
```ts
easingFunc?: EasingType;
```

@remarks
The optional easing type that the frame will use for
position.

/

### `timeSeconds`
```ts
timeSeconds: number;
```

@remarks
Time value that the camera will be at the given alpha.

/
