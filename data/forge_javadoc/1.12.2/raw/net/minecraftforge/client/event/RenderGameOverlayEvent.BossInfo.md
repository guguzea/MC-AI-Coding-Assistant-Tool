---
title: "RenderGameOverlayEvent.BossInfo"
description: "public static class RenderGameOverlayEvent.BossInfo extends RenderGameOverlayEvent.Pre"
package: "net/minecraftforge/client/event"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/RenderGameOverlayEvent.BossInfo.html"
sourceType: javadoc
---

# RenderGameOverlayEvent.BossInfo

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.RenderGameOverlayEvent → net.minecraftforge.client.event.RenderGameOverlayEvent.Pre → net.minecraftforge.client.event.RenderGameOverlayEvent.BossInfo

## Class signature

```java
public static class RenderGameOverlayEvent.BossInfo extends RenderGameOverlayEvent.Pre
```

## Constructors

- `BossInfo(RenderGameOverlayEvent parent, RenderGameOverlayEvent.ElementType type, BossInfoClient bossInfo, int x, int y, int increment)`

## Methods

- `BossInfoClient getBossInfo()`
- `int getIncrement()`
- `int getX()`
- `int getY()`
- `void setIncrement(int increment)` — Sets the amount to move down before rendering the next bar
