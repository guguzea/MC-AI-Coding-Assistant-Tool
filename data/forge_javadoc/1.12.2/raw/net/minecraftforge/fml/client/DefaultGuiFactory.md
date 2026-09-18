---
title: "DefaultGuiFactory"
description: "Return an initialized GuiScreen ."
package: "net/minecraftforge/fml/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/DefaultGuiFactory.html"
sourceType: javadoc
---

# DefaultGuiFactory

## Class signature

```java
public class DefaultGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `protected DefaultGuiFactory(java.lang.String modid, java.lang.String title)`

## Methods

- `public boolean hasConfigGui()`
- `public void initialize( Minecraft minecraftInstance)`
- `public GuiScreen createConfigGui( GuiScreen parentScreen)`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `public static IModGuiFactory forMod( ModContainer mod)`

## Description

Return an initialized GuiScreen .
