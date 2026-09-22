> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.687Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayAnimationOptions (interface)

```ts
export interface PlayAnimationOptions {
```

Contains additional options for how an animation is played.

## Members（5）

### `blendOutTime`
```ts
blendOutTime?: number;
```

@remarks
Amount of time to fade out after an animation stops.

/

### `controller`
```ts
controller?: string;
```

@remarks
Specifies a controller to use that has been defined on the
entity.

/

### `nextState`
```ts
nextState?: string;
```

@remarks
Specifies the state to transition to.

/

### `players`
```ts
players?: Player[];
```

@remarks
A list of players the animation will be visible to.

/

### `stopExpression`
```ts
stopExpression?: string;
```

@remarks
Specifies a Molang expression for when this animation should
complete.

/
