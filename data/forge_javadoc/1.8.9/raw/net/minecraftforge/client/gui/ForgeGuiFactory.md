---
title: "ForgeGuiFactory"
description: "This is the base GuiConfig screen class that all the other Forge-specific config screens will be called from. Since Forge has multiple config files I thought I would use that opportunity to show some "
package: "net/minecraftforge/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/gui/ForgeGuiFactory.html"
sourceType: javadoc
---

# ForgeGuiFactory

## Class signature

```java
public class ForgeGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `public ForgeGuiFactory()`

## Methods

- `public void initialize( Minecraft minecraftInstance)`
- `public java.lang.Class<? extends GuiScreen > mainConfigGuiClass()`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `public IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor( IModGuiFactory.RuntimeOptionCategoryElement element)`

## Description

This is the base GuiConfig screen class that all the other Forge-specific config screens will be called from. Since Forge has multiple config files I thought I would use that opportunity to show some 
