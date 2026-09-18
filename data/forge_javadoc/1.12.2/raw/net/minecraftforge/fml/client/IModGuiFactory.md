---
title: "IModGuiFactory"
description: "This is the interface you need to implement if you want to provide a customized config screen. DefaultGuiFactory provides a default implementation of this interface and will be used if the mod does no"
package: "net/minecraftforge/fml/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/IModGuiFactory.html"
sourceType: javadoc
---

# IModGuiFactory

## Class signature

```java
public interface IModGuiFactory
```

## Methods

- `void initialize( Minecraft minecraftInstance)`
- `boolean hasConfigGui()`
- `GuiScreen createConfigGui( GuiScreen parentScreen)`
- `java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`

## Description

This is the interface you need to implement if you want to provide a customized config screen. DefaultGuiFactory provides a default implementation of this interface and will be used if the mod does no
