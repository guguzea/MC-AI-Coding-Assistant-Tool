> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.540Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ScreenDisplay (class)

```ts
export class ScreenDisplay {
```

Contains information about user interface elements that are
showing up on the screen.
@example setTitle.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function setTitle(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  if (players.length > 0) {
    players[0].onScreenDisplay.setTitle('§o§6Fancy Title§r');
  }
}
```
@example setTitleAndSubtitle.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function setTitleAndSubtitle(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle('Chapter 1', {
    stayDuration: 100,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: 'Trouble in Block Town',
  });
}
```
@example countdown.ts
```typescript
import { world, system, DimensionLocation } from '@minecraft/server';

function countdown(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle('Get ready!', {
    stayDuration: 220,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: '10',
  });

  let countdown = 10;

  const intervalId = system.runInterval(() => {
    countdown--;
    players[0].onScreenDisplay.updateSubtitle(countdown.toString());

    if (countdown == 0) {
      system.clearRun(intervalId);
    }
  }, 20);
}
```

## Members（10）

### `private`
```ts
private constructor();
```

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns true if the current reference to this screen display
manager object is valid and functional.

/

### `getHiddenHudElements`
```ts
getHiddenHudElements(): HudElement[];
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `hideAllExcept`
```ts
hideAllExcept(hudElements?: HudElement[]): void;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `isForcedHidden`
```ts
isForcedHidden(hudElement: HudElement): boolean;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `resetHudElementsVisibility`
```ts
resetHudElementsVisibility(): void;
```

@remarks
This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `setActionBar`
```ts
setActionBar(text: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Set the action bar text - a piece of text that displays
beneath the title and above the hot-bar.

This function can't be called in restricted-execution mode.

@param text
New value for the action bar text.
@throws This function can throw errors.

{@link InvalidEntityError}

{@link RawMessageError}
/

### `setHudVisibility`
```ts
setHudVisibility(visible: HudVisibility, hudElements?: HudElement[]): void;
```

@remarks
Sets visibility of a particular element of the heads up
display (HUD).

This function can't be called in restricted-execution mode.

@param visible
Whether to set the HUD element to invisible, or to reset it
back to its default.
@param hudElements
Optional list of HUD elements to configure visibility for.
@throws This function can throw errors.

{@link InvalidEntityError}
/

### `setTitle`
```ts
setTitle(title: (RawMessage | string)[] | RawMessage | string, options?: TitleDisplayOptions): void;
```

@remarks
Will cause a title to show up on the player's on screen
display. Will clear the title if set to empty string. You
can optionally specify an additional subtitle as well as
fade in, stay and fade out times.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}

{@link RawMessageError}
@example setTitle.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function setTitle(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  if (players.length > 0) {
    players[0].onScreenDisplay.setTitle('§o§6Fancy Title§r');
  }
}
```
@example setTitleAndSubtitle.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function setTitleAndSubtitle(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle('Chapter 1', {
    stayDuration: 100,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: 'Trouble in Block Town',
  });
}
```
@example countdown.ts
```typescript
import { world, system, DimensionLocation } from '@minecraft/server';

function countdown(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle('Get ready!', {
    stayDuration: 220,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: '10',
  });

  let countdown = 10;

  const intervalId = system.runInterval(() => {
    countdown--;
    players[0].onScreenDisplay.updateSubtitle(countdown.toString());

    if (countdown == 0) {
      system.clearRun(intervalId);
    }
  }, 20);
}
```
/

### `updateSubtitle`
```ts
updateSubtitle(subtitle: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Updates the subtitle if the subtitle was previously
displayed via the setTitle method.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidEntityError}

{@link RawMessageError}
@example countdown.ts
```typescript
import { world, system, DimensionLocation } from '@minecraft/server';

function countdown(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle('Get ready!', {
    stayDuration: 220,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: '10',
  });

  let countdown = 10;

  const intervalId = system.runInterval(() => {
    countdown--;
    players[0].onScreenDisplay.updateSubtitle(countdown.toString());

    if (countdown == 0) {
      system.clearRun(intervalId);
    }
  }, 20);
}
```
/
