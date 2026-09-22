> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.525Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PrimitiveShapesManager (class)

```ts
export class PrimitiveShapesManager {
```

Primitive Shapes class used to allow adding and removing
text primitives to the world.

## Members（5）

### `private`
```ts
private constructor();
```

### `maxShapes`
```ts
readonly maxShapes: number;
```

@remarks
This is the maximum number of allowed primitive shapes.

/

### `addText`
```ts
addText(text: TextPrimitive, dimension?: Dimension): void;
```

@remarks
Adds a new text primitive to the world.

@param text
The text primitive to be added.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link PrimitiveShapeError}
/

### `removeAll`
```ts
removeAll(): void;
```

@remarks
Removes all text primitives from the world.

/

### `removeText`
```ts
removeText(text: TextPrimitive): void;
```

@remarks
Removes an instance of a text primitive from the world. This
is equivalent to calling remove on the text itself.

/
