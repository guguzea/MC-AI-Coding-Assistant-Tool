> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.444Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerCursorInventoryComponent (class)

```ts
export class PlayerCursorInventoryComponent extends EntityComponent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `item`
```ts
readonly item?: ItemStack;
static readonly componentId = 'minecraft:cursor_inventory';
```

@remarks
The ItemStack currently in the players cursor inventory.

@throws This property can throw when used.
/

### `clear`
```ts
clear(): void;
```

@remarks
Clears the players cursor inventory.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
