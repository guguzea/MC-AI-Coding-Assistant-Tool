---
title: "HoverChecker"
description: "public class HoverChecker extends java.lang.Object"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/HoverChecker.html"
sourceType: javadoc
---

# HoverChecker

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.HoverChecker

## Class signature

```java
public class HoverChecker extends java.lang.Object
```

## Constructors

- `HoverChecker(GuiButton button, int threshold)`
- `HoverChecker(int top, int bottom, int left, int right, int threshold)`

## Methods

- `boolean checkHover(int mouseX, int mouseY)` — Checks if the mouse is in the hover region.
- `boolean checkHover(int mouseX, int mouseY, boolean canHover)` — Checks if the mouse is in the hover region.
- `void resetHoverTimer()` — Manually resets the hover timer.
- `void updateBounds(int top, int bottom, int left, int right)` — Call this method if the intended region has changed such as if the region must follow a scrolling list.
