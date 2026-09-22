> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.188Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ClientSystemInfo (class)

```ts
export class ClientSystemInfo extends SystemInfo {
```

## Members（4）

### `private`
```ts
private constructor();
```

### `locale`
```ts
readonly locale: string;
```

@remarks
The locale selected by the client (e.g., en_US, fr_FR,
ja_JP). Note that in most cases, server scripts should not
use this property to manually localize text. Instead, use
{@link RawMessage} with a translate field to send
localization keys, allowing each client to resolve them in
their own language automatically. Direct use of locale for
localization is fragile and may produce unexpected results
when players with different languages are on the same
server.

/

### `maxRenderDistance`
```ts
readonly maxRenderDistance: number;
```

@remarks
The max render distance for the device in chunks.

/

### `platformType`
```ts
readonly platformType: PlatformType;
```

@remarks
The platform type of the device.

/
