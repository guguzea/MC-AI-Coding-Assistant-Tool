> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.097Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# InputPermissionCategory (enum)

```ts
export enum InputPermissionCategory {
```

Input permission categories. Used by {@link
PlayerInputPermissionCategoryChangeAfterEvent} to specify
which category was changed and {@link
PlayerInputPermissions} to get or set permissions.

## Members（11）

### `Camera`
```ts
Camera = 1
```

### `Movement`
```ts
Movement = 2
```

### `LateralMovement`
```ts
LateralMovement = 4
```

### `Sneak`
```ts
Sneak = 5
```

### `Jump`
```ts
Jump = 6
```

### `Mount`
```ts
Mount = 7
```

### `Dismount`
```ts
Dismount = 8
```

### `MoveForward`
```ts
MoveForward = 9
```

### `MoveBackward`
```ts
MoveBackward = 10
```

### `MoveLeft`
```ts
MoveLeft = 11
```

### `MoveRight`
```ts
MoveRight = 12
```
