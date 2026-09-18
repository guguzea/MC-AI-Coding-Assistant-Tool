---
title: "IEntitySelectorFactory"
description: "Allows mods to create custom selectors in commands. Registered in GameRegistry.registerEntitySelector(IEntitySelectorFactory, String...) For an example implementation, see CustomEntitySelectorTest"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/IEntitySelectorFactory.html"
sourceType: javadoc
---

# IEntitySelectorFactory

## Class signature

```java
public interface IEntitySelectorFactory
```

## Methods

- `java.util.List<<any>> createPredicates(java.util.Map<java.lang.String,java.lang.String> arguments, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`

## Description

Allows mods to create custom selectors in commands. Registered in GameRegistry.registerEntitySelector(IEntitySelectorFactory, String...) For an example implementation, see CustomEntitySelectorTest
