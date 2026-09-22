> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.549Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# SetItemDamageFunction (class)

```ts
export class SetItemDamageFunction extends LootItemFunction {
```

## Members（2）

### `private`
```ts
private constructor();
```

### `damage`
```ts
readonly damage: minecraftcommon.NumberRange;
```

@remarks
The value range from which the function randomly chooses the
durability value to assign. Contains minimum and maximum
values. Must always be between 0.0 and 1.0.

/
