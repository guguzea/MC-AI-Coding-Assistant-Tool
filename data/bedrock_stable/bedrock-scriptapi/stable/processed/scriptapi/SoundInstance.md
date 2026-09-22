> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.560Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# SoundInstance (class)

```ts
export class SoundInstance {
```

Represents a handle to a sound that has been played. The
handle is required to control the sound while it is playing
(for example, to call `stop`, `setVolume`, `setPitch`,
`fade`, or `seekTo`). Infinitely-looping sounds (started
with `loop: -1`) stop automatically when the last
`SoundInstance` reference is dropped; retain the handle for
as long as the sound should keep playing.

## Members（2）

### `private`
```ts
private constructor();
```

### `stop`
```ts
stop(): void;
```

@remarks
Stops this sound instance from playing.

This function can't be called in restricted-execution mode.

/
