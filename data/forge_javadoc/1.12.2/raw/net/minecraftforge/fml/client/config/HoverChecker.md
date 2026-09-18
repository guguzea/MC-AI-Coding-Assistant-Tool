---
title: "HoverChecker"
description: "This class implements an easy way to check if the mouse has hovered within a certain region of the screen for a given period of time. The region can be defined manually or by supplying a GuiButton obj"
package: "net/minecraftforge/fml/client/config"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/config/HoverChecker.html"
sourceType: javadoc
---

# HoverChecker

## Class signature

```java
public class HoverChecker extends java.lang.Object
```

## Constructors

- `public HoverChecker(int top, int bottom, int left, int right, int threshold)`
- `public HoverChecker( GuiButton button, int threshold)`

## Methods

- `public void updateBounds(int top, int bottom, int left, int right)`
- `public boolean checkHover(int mouseX, int mouseY)`
- `public boolean checkHover(int mouseX, int mouseY, boolean canHover)`
- `public void resetHoverTimer()`

## Description

This class implements an easy way to check if the mouse has hovered within a certain region of the screen for a given period of time. The region can be defined manually or by supplying a GuiButton obj
