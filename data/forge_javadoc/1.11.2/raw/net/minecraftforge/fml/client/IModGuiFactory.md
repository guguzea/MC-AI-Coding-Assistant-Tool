---
title: "IModGuiFactory"
description: "Represents an option category and entry in the runtime gui options list."
package: "net/minecraftforge/fml/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/IModGuiFactory.html"
sourceType: javadoc
---

# IModGuiFactory

## Class signature

```java
public interface IModGuiFactory
```

## Methods

- `void initialize( Minecraft minecraftInstance)`
- `java.lang.Class<? extends GuiScreen > mainConfigGuiClass()`
- `java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `@Nullable IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor( IModGuiFactory.RuntimeOptionCategoryElement element)`

## Description

Represents an option category and entry in the runtime gui options list.
