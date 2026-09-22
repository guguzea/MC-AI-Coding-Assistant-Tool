> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.209Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EffectTypes (class)

```ts
export class EffectTypes {
```

Represents a type of effect - like poison - that can be
applied to an entity.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(identifier: string): EffectType | undefined;
```

@remarks
Effect type for the given identifier.

This function can't be called in restricted-execution mode.

@param identifier
The identifier for the effect.
@returns
Effect type for the given identifier or undefined if the
effect does not exist.
/

### `getAll`
```ts
static getAll(): EffectType[];
```

@remarks
Gets all effects.

This function can't be called in restricted-execution mode.

@returns
A list of all effects.
/
