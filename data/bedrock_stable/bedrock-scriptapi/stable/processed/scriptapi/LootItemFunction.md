> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.420Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LootItemFunction (class)

```ts
export class LootItemFunction {
```

An abstract base class from which all loot item functions
are derived. Loot item functions can modify loot drops in a
variety of ways as they happen, optionally dependent on a
set of conditions which must be met.

## Members（1）

### `private`
```ts
private constructor();
readonly conditions: LootItemCondition[];
```
