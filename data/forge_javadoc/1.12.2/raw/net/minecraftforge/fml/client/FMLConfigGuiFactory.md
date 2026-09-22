---
title: "FMLConfigGuiFactory"
description: "public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory"
package: "net/minecraftforge/fml/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/FMLConfigGuiFactory.html"
sourceType: javadoc
---

# FMLConfigGuiFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.FMLConfigGuiFactory

## Class signature

```java
public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `FMLConfigGuiFactory()`

## Methods

- `GuiScreen createConfigGui(GuiScreen parentScreen)` — Return an initialized GuiScreen .
- `boolean hasConfigGui()` — If this method returns false, the config button in the mod list will be disabled
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.
