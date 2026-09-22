---
title: "IModGuiFactory.RuntimeOptionGuiHandler"
description: "public static interface IModGuiFactory.RuntimeOptionGuiHandler"
package: "net/minecraftforge/fml/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/IModGuiFactory.RuntimeOptionGuiHandler.html"
sourceType: javadoc
---

# IModGuiFactory.RuntimeOptionGuiHandler

## Class signature

```java
public static interface IModGuiFactory.RuntimeOptionGuiHandler
```

## Methods

- `void actionCallback(int actionId)` — Called if a widget with id >= 100 is fired.
- `void addWidgets(java.util.List<Gui> widgetList, int x, int y, int w, int h)` — Called to add widgets to the screen, such as buttons.
- `void close()` — Called when this handler is about to go away (probably replaced by another one, or closing the option screen)
- `void paint(int x, int y, int w, int h)` — Called to paint the rectangle specified.
