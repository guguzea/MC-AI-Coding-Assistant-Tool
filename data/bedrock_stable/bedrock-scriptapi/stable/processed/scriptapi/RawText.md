> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.698Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# RawText (interface)

```ts
export interface RawText {
```

A `RawMessage` with only the `rawtext` property. When a
`RawMessage` is serialized the contents are put into a
rawtext property, so this is useful when reading saved
RawMessages. See `BlockSignComponent.setText` and
`BlockSignComponent.getRawText` for examples.

## Members（1）

### `rawtext`
```ts
rawtext?: RawMessage[];
```

@remarks
A serialization of the current value of an associated sign.

/
