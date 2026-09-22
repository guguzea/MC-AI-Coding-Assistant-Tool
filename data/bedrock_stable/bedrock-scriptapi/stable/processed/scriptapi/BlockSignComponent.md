> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.176Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockSignComponent (class)

```ts
export class BlockSignComponent extends BlockComponent {
```

## Members（8）

### `private`
```ts
private constructor();
```

### `isWaxed`
```ts
readonly isWaxed: boolean;
static readonly componentId = 'minecraft:sign';
```

@remarks
Whether or not players can edit the sign. This happens if a
sign has had a honeycomb used on it or `setWaxed` was called
on the sign.

@throws This property can throw when used.
/

### `getRawText`
```ts
getRawText(side?: SignSide): RawText | undefined;
```

@remarks
Returns the RawText of the sign if `setText` was called with
a RawMessage or a RawText object, otherwise returns
undefined.

@param side
The side of the sign to read the message from. If not
provided, this will return the message from the front side
of the sign.
Defaults to: 0
@throws This function can throw errors.
/

### `getText`
```ts
getText(side?: SignSide): string | undefined;
```

@remarks
Returns the text of the sign if `setText` was called with a
string, otherwise returns undefined.

@param side
The side of the sign to read the message from. If not
provided, this will return the message from the front side
of the sign.
Defaults to: 0
@throws This function can throw errors.
/

### `getTextDyeColor`
```ts
getTextDyeColor(side?: SignSide): DyeColor | undefined;
```

@remarks
Gets the dye that is on the text or undefined if the sign
has not been dyed.

@param side
The side of the sign to read the dye from. If not provided,
this will return the dye on the front side of the sign.
Defaults to: 0
@throws This function can throw errors.
/

### `setText`
```ts
setText(message: RawMessage | string, side?: SignSide): void;
```

@remarks
Sets the text of the sign component.

This function can't be called in restricted-execution mode.

@param message
The message to set on the sign. If set to a string, then
call `getText` to read that string. If set to a RawMessage,
then calling `getRawText` will return a RawText.
@param side
The side of the sign the message will be set on. If not
provided, the message will be set on the front side of the
sign.
Defaults to: 0
@throws
Throws if the provided message is greater than 512
characters in length.
/

### `setTextDyeColor`
```ts
setTextDyeColor(color?: DyeColor, side?: SignSide): void;
```

@remarks
Sets the dye color of the text.

This function can't be called in restricted-execution mode.

@param color
The dye color to apply to the sign or undefined to clear the
dye on the sign.
Defaults to: null
@param side
The side of the sign the color will be set on. If not
provided, the color will be set on the front side of the
sign.
Defaults to: 0
@throws This function can throw errors.
/

### `setWaxed`
```ts
setWaxed(waxed: boolean): void;
```

@remarks
Makes it so players cannot edit this sign.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
