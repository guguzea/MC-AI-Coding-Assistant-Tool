> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.351Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# InputInfo (class)

```ts
export class InputInfo {
```

Contains the input information for a client instance.

## Members（5）

### `private`
```ts
private constructor();
```

### `lastInputModeUsed`
```ts
readonly lastInputModeUsed: InputMode;
```

@remarks
The last input mode used by the player.

@throws This property can throw when used.

{@link minecraftcommon.EngineError}

{@link InvalidEntityError}
/

### `touchOnlyAffectsHotbar`
```ts
readonly touchOnlyAffectsHotbar: boolean;
```

@remarks
Whether the player touch input only affects the touchbar or
not.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `getButtonState`
```ts
getButtonState(button: InputButton): ButtonState;
```

@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link InvalidEntityError}
/

### `getMovementVector`
```ts
getMovementVector(): Vector2;
```

@throws This function can throw errors.

{@link InvalidEntityError}
/
