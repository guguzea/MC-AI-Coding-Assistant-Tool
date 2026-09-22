---
title: "ForgeGuiFactory"
description: "public class ForgeGuiFactory extends java.lang.Object implements IModGuiFactory"
package: "net/minecraftforge/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/gui/ForgeGuiFactory.html"
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

- `GuiScreen createConfigGui(GuiScreen parent)` — Return an initialized GuiScreen .
- `boolean hasConfigGui()` — If this method returns false, the config button in the mod list will be disabled
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.
