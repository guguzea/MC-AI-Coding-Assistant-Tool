---
title: "IModGuiFactory"
description: "public interface IModGuiFactory"
package: "cpw/mods/fml/client"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/IModGuiFactory.html"
sourceType: javadoc
---

# IModGuiFactory

## Class signature

```java
public interface IModGuiFactory
```

## Methods

- `IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor(IModGuiFactory.RuntimeOptionCategoryElement element)` — Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement .
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.lang.Class<? extends GuiScreen> mainConfigGuiClass()` — Return the name of a class extending GuiScreen .
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.
