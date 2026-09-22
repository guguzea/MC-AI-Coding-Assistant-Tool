> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.186Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Camera (class)

```ts
export class Camera {
```

Contains methods relating to the active camera for the
specified player.

## Members（9）

### `private`
```ts
private constructor();
```

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether the Camera is valid to access and use. A
Camera is considered valid when the owning Player of the
Camera is loaded and valid itself.

/

### `attachToEntity`
```ts
attachToEntity(attachCameraOptions?: CameraAttachOptions): void;
```

@remarks
Attaches the camera to a non-player entity.

This function can't be called in restricted-execution mode.

@param attachCameraOptions
Options for the entity the camera is attaching to. Contains
the entity identifier and optional entity location.
@throws This function can throw errors.
/

### `clear`
```ts
clear(): void;
```

@remarks
Clears the active camera for the specified player. Causes
the specified players to end any in-progress camera
perspectives, including any eased camera motions, and return
to their normal perspective.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `fade`
```ts
fade(fadeCameraOptions?: CameraFadeOptions): void;
```

@remarks
Begins a camera fade transition. A fade transition is a
full-screen color that fades-in, holds, and then fades-out.

This function can't be called in restricted-execution mode.

@param fadeCameraOptions
Additional options around camera fade operations.
@throws This function can throw errors.
/

### `playAnimation`
```ts
playAnimation(splineType: CatmullRomSpline | LinearSpline, cameraAnimationOptions: AnimationOptions): void;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setCamera`
```ts
setCamera(
  cameraPreset: string,
  setOptions?:
  | CameraFixedBoomOptions
  | CameraSetFacingOptions
  | CameraSetLocationOptions
  | CameraSetPosOptions
  | CameraSetRotOptions
  | CameraTargetOptions,
): void;
```

@remarks
Sets the current active camera for the specified player.

This function can't be called in restricted-execution mode.

@param cameraPreset
Identifier of a camera preset file defined within JSON.
@param setOptions
Additional options for the camera.
@throws This function can throw errors.
/

### `setDefaultCamera`
```ts
setDefaultCamera(cameraPreset: string, easeOptions?: EaseOptions): void;
```

@remarks
Sets the current active camera for the specified player and
resets the position and rotation to the values defined in
the JSON.

This function can't be called in restricted-execution mode.

@param cameraPreset
Identifier of a camera preset file defined within JSON.
@param easeOptions
Options to ease the camera back to its original position and
rotation.
@throws This function can throw errors.
/

### `setFov`
```ts
setFov(fovCameraOptions?: CameraFovOptions): void;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
