> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.166Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockFluidContainerComponent (class)

```ts
export class BlockFluidContainerComponent extends BlockComponent {
```

## Members（7）

### `private`
```ts
private constructor();
```

### `fillLevel`
```ts
fillLevel: number;
```

@remarks
Relative fill level of the fluid container.

This property can't be edited in restricted-execution mode.

/

### `fluidColor`
```ts
fluidColor: RGBA;
static readonly componentId = 'minecraft:fluid_container';
```

@remarks
Custom color of the fluid in the container.

This property can't be edited in restricted-execution mode.

/

### `addDye`
```ts
addDye(dye: ItemType): void;
```

@remarks
Adds a dye to the fluid. The dye color is combined with any
existing custom color.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `getFluidType`
```ts
getFluidType(): FluidType;
```

@remarks
Gets the current fluid type in the container.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setFluidType`
```ts
setFluidType(fluidType: FluidType): void;
```

@remarks
Sets the current fluid type in the container.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setPotion`
```ts
setPotion(itemStack: ItemStack): void;
```

@remarks
Sets a potion item in the container. Changes the container's
fluid type to potion.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
