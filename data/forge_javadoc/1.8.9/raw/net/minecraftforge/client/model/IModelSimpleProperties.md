---
title: "IModelSimpleProperties"
description: "Implement this if the model can process \"smooth_lighting\" or \"gui3d\" attributes from the json."
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/IModelSimpleProperties.html"
sourceType: javadoc
---

# IModelSimpleProperties

## Class signature

```java
public interface IModelSimpleProperties<M extends IModelSimpleProperties<M>> extends IModel
```

## Methods

- `M smoothLighting(boolean value)`
- `M gui3d(boolean value)`

## Description

Implement this if the model can process "smooth_lighting" or "gui3d" attributes from the json.
