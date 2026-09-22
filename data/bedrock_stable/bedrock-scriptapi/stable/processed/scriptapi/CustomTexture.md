> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.626Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# CustomTexture (interface)

```ts
export interface CustomTexture {
```

## Members（3）

### `iconHeight`
```ts
iconHeight: number;
```

@remarks
The height of the icon, in relative units. Value must be
between 0.0 and 1.0, inclusive.

Bounds: [0, 1]
/

### `iconWidth`
```ts
iconWidth: number;
```

@remarks
The width of the icon, in relative units. Value must be
between 0.0 and 1.0, inclusive.

Bounds: [0, 1]
/

### `path`
```ts
path: string;
```

@remarks
The resource path to the custom texture. This should be a
valid string path to a texture asset.

/
