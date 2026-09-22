> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.204Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Effect (class)

```ts
export class Effect {
```

Represents an effect - like poison - that has been added to
an Entity.

## Members（6）

### `private`
```ts
private constructor();
```

### `amplifier`
```ts
readonly amplifier: number;
```

@remarks
Gets an amplifier that may have been applied to this effect.
Sample values range typically from 0 to 4. Example: The
effect 'Jump Boost II' will have an amplifier value of 1.

@throws This property can throw when used.
/

### `displayName`
```ts
readonly displayName: string;
```

@remarks
Gets the player-friendly name of this effect.

@throws This property can throw when used.
/

### `duration`
```ts
readonly duration: number;
```

@remarks
Gets the entire specified duration, in ticks, of this
effect. There are 20 ticks per second. Use {@link
TicksPerSecond} constant to convert between ticks and
seconds.

@throws This property can throw when used.
/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether an effect instance is available for use in
this context.

/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Gets the type id of this effect.

@throws This property can throw when used.
/
