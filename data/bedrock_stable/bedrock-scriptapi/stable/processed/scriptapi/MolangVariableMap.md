> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.431Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# MolangVariableMap (class)

```ts
export class MolangVariableMap {
```

Contains a set of additional variable values for further
defining how rendering and animations function.

## Members（5）

### `setColorRGB`
```ts
setColorRGB(variableName: string, color: RGB): void;
```

@remarks
Adds the following variables to Molang:
- `<variable_name>.r` - Red color value [0-1]
- `<variable_name>.g` - Green color value [0-1]
- `<variable_name>.b` - Blue color value [0-1]

@throws This function can throw errors.
/

### `setColorRGBA`
```ts
setColorRGBA(variableName: string, color: RGBA): void;
```

@remarks
Adds the following variables to Molang:
- `<variable_name>.r` - Red color value [0-1]
- `<variable_name>.g` - Green color value [0-1]
- `<variable_name>.b` - Blue color value [0-1]
- `<variable_name>.a` - Alpha (transparency) color value
[0-1]

@throws This function can throw errors.
/

### `setFloat`
```ts
setFloat(variableName: string, number: number): void;
```

@remarks
Sets a numeric (decimal) value within the Molang variable
map.

@param variableName
Name of the float-based number to set.
@param number
Value for the Molang-based variable to set.
@throws This function can throw errors.
/

### `setSpeedAndDirection`
```ts
setSpeedAndDirection(variableName: string, speed: number, direction: Vector3): void;
```

@remarks
Adds the following variables to Molang:
- `<variable_name>.speed` - Speed number provided
- `<variable_name>.direction_x` - X value from the {@link
Vector3} provided
- `<variable_name>.direction_y` - Y value from the {@link
Vector3} provided
- `<variable_name>.direction_z` - Z value from the {@link
Vector3} provided

@throws This function can throw errors.
/

### `setVector3`
```ts
setVector3(variableName: string, vector: Vector3): void;
```

@remarks
Adds the following variables to Molang:
- `<variable_name>.x` - X value from the {@link Vector3}
provided
- `<variable_name>.y` - Y value from the {@link Vector3}
provided
- `<variable_name>.z` - Z value from the {@link Vector3}
provided

@throws This function can throw errors.
/
