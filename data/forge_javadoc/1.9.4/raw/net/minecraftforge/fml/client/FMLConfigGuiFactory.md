---
title: "FMLConfigGuiFactory"
description: "Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement ."
package: "net/minecraftforge/fml/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/client/FMLConfigGuiFactory.html"
sourceType: javadoc
---

# FMLConfigGuiFactory

## Class signature

```java
public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `public FMLConfigGuiFactory()`

## Methods

- `public void initialize( Minecraft minecraftInstance)`
- `public java.lang.Class<? extends GuiScreen > mainConfigGuiClass()`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `public IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor( IModGuiFactory.RuntimeOptionCategoryElement element)`

## Description

Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement .
