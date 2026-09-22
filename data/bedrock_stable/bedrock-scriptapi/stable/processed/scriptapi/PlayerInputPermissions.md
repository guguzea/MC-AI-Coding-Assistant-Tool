> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.460Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerInputPermissions (class)

```ts
export class PlayerInputPermissions {
```

Contains APIs to enable/disable player input permissions.

## Members（3）

### `private`
```ts
private constructor();
```

### `isPermissionCategoryEnabled`
```ts
isPermissionCategoryEnabled(permissionCategory: InputPermissionCategory): boolean;
```

@remarks
Returns true if an input permission is enabled.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setPermissionCategory`
```ts
setPermissionCategory(permissionCategory: InputPermissionCategory, isEnabled: boolean): void;
```

@remarks
Enable or disable an input permission. When enabled the
input will work, when disabled will not work.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
