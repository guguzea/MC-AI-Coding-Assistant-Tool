> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.688Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerAimAssistSettings (interface)

```ts
export interface PlayerAimAssistSettings {
```

Settings relating to a player's aim-assist targeting.

## Members（4）

### `distance`
```ts
distance?: number;
```

@remarks
The view distance limit to use for aim-assist targeting.

/

### `presetId`
```ts
presetId: string;
```

@remarks
The Id of the aim-assist preset to activate. Must have a
namespace.

/

### `targetMode`
```ts
targetMode?: AimAssistTargetMode;
```

@remarks
The mode to use for aim-assist targeting.

/

### `viewAngle`
```ts
viewAngle?: Vector2;
```

@remarks
The view angle limit to use for aim-assist targeting.

/
