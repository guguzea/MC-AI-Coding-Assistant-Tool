> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.328Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityStrengthComponent (class)

```ts
export class EntityStrengthComponent extends EntityComponent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `max`
```ts
readonly max: number;
```

@remarks
Maximum strength of this entity, as defined in the entity
type definition.

@throws This property can throw when used.
/

### `value`
```ts
readonly value: number;
static readonly componentId = 'minecraft:strength';
```

@remarks
Current value of the strength component that has been set
for entities.

@throws This property can throw when used.
/
