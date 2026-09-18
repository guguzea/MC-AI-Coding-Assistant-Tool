---
title: "IFluidHandlerItem"
description: "ItemStacks handled by an IFluidHandler may change, so this class allows users of the fluid handler to get the container after it has been used."
package: "net/minecraftforge/fluids/capability"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/IFluidHandlerItem.html"
sourceType: javadoc
---

# IFluidHandlerItem

## Class signature

```java
public interface IFluidHandlerItem extends IFluidHandler
```

## Methods

- `@Nonnull ItemStack getContainer()`

## Description

ItemStacks handled by an IFluidHandler may change, so this class allows users of the fluid handler to get the container after it has been used.
