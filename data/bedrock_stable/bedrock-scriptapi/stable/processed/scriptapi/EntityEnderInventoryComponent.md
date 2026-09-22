> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.237Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityEnderInventoryComponent (class)

```ts
export class EntityEnderInventoryComponent extends EntityComponent {
```

## Members（2）

### `private`
```ts
private constructor();
```

### `container`
```ts
readonly container: Container;
static readonly componentId = 'minecraft:ender_inventory';
```

@remarks
Defines the ender inventory container for this entity. The
container will be undefined if the entity has been removed.

@throws This property can throw when used.

{@link InvalidEntityError}
/
