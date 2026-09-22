> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.168Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockMapColorComponent (class)

```ts
export class BlockMapColorComponent extends BlockComponent {
```

## Members（4）

### `private`
```ts
private constructor();
```

### `color`
```ts
readonly color: RGBA;
```

@remarks
Base map color defined for that block.

@throws This property can throw when used.
/

### `tintedColor`
```ts
readonly tintedColor: RGBA;
```

@remarks
Returns the base color multiplied to the evaluated tint at
the given position.

/

### `tintMethod`
```ts
readonly tintMethod: TintMethod;
static readonly componentId = 'minecraft:map_color';
```

@remarks
Type of tint applied to the color.

@throws This property can throw when used.
/
