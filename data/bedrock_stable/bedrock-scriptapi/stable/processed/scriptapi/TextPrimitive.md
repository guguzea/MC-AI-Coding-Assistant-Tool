> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.573Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TextPrimitive (class)

```ts
export class TextPrimitive extends PrimitiveShape {
```

## Members（7）

### `backfaceVisible`
```ts
backfaceVisible: boolean;
```

@remarks
If set to true, the text primitive will render the back-face
of the background. Defaults to true but will always be false
if 'useRotation' is set to false.

/

### `backgroundColorOverride`
```ts
backgroundColorOverride?: RGBA;
```

@remarks
The color of the background plate of the text. If set to
undefined, it will use the default color.

/

### `depthTest`
```ts
depthTest: boolean;
```

@remarks
If set to true, the text will be hidden behind blocks or
entities. By default this is set to false (will always
render).

/

### `text`
```ts
readonly text: RawMessage | string;
```

@remarks
Get the text of the debug text shape. Returns the RawText of
the debug text if `setText` was called with a RawMessage or
a RawText object, otherwise returns a string.

/

### `textBackfaceVisible`
```ts
textBackfaceVisible: boolean;
```

@remarks
If set to true, the text primitive will render the back-face
of the text. Defaults to true but will always be false if
'useRotation' is set to false.

/

### `useRotation`
```ts
useRotation: boolean;
constructor(location: DimensionLocation | Vector3, text: RawMessage | string);
```

@remarks
If set to true, the text will not face the camera and
instead will use the rotation from the shape.

/

### `setText`
```ts
setText(text: RawMessage | string): void;
```

@remarks
Sets the text to display.

@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link RawMessageError}
/
