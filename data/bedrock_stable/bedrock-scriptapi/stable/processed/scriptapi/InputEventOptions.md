> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.678Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# InputEventOptions (interface)

```ts
export interface InputEventOptions {
```

An interface that is passed into {@link
PlayerButtonInputAfterEventSignal.subscribe} that filters
out which events are passed to the provided callback.

## Members（2）

### `buttons`
```ts
buttons?: InputButton[];
```

@remarks
The buttons the callback should be called for. If undefined,
the callback will be called for all buttons.

/

### `state`
```ts
state?: ButtonState;
```

@remarks
The state the callback should be called for. If undefined,
the callback will be called for all button states.

/
