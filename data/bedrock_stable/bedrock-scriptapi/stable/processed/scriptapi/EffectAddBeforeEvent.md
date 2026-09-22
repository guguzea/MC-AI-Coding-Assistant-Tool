> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.206Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EffectAddBeforeEvent (class)

```ts
export class EffectAddBeforeEvent {
```

Contains information related to changes to an effect - like
poison - being added to an entity.

## Members（5）

### `private`
```ts
private constructor();
```

### `cancel`
```ts
cancel: boolean;
```

@remarks
When set to true will cancel the event.

/

### `duration`
```ts
duration: number;
```

@remarks
Effect duration.

/

### `effectType`
```ts
readonly effectType: string;
```

@remarks
The type of the effect that is being added.

/

### `entity`
```ts
readonly entity: Entity;
```

@remarks
Entity that the effect is being added to.

/
