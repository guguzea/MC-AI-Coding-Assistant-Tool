---
title: "ForgeGuiFactory"
description: "public class ForgeGuiFactory extends java.lang.Object implements IModGuiFactory"
package: "net/minecraftforge/client/gui"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/gui/ForgeGuiFactory.html"
sourceType: javadoc
---

# ForgeGuiFactory

**Inheritance:** java.lang.Object → net.minecraftforge.client.gui.ForgeGuiFactory

## Class signature

```java
public class ForgeGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `ForgeGuiFactory()`

## Methods

- `IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor(IModGuiFactory.RuntimeOptionCategoryElement element)` — Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement .
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.lang.Class<? extends GuiScreen> mainConfigGuiClass()` — Return the name of a class extending GuiScreen .
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.
