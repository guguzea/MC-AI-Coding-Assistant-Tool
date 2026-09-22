> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.235Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityDieAfterEvent (class)

```ts
export class EntityDieAfterEvent {
```

Contains data related to the death of an entity in the game.

## Members（3）

### `private`
```ts
private constructor();
```

### `damageSource`
```ts
readonly damageSource: EntityDamageSource;
```

@remarks
If specified, provides more information on the source of
damage that caused the death of this entity.

/

### `deadEntity`
```ts
readonly deadEntity: Entity;
```

@remarks
Now-dead entity object.

/
