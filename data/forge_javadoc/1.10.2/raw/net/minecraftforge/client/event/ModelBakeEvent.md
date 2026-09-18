---
title: "ModelBakeEvent"
description: "Fired when the ModelManager is notified of the resource manager reloading. Called after model registry is setup, but before it's passed to BlockModelShapes."
package: "net/minecraftforge/client/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/ModelBakeEvent.html"
sourceType: javadoc
---

# ModelBakeEvent

## Class signature

```java
public class ModelBakeEvent extends Event
```

## Constructors

- `public ModelBakeEvent( ModelManager modelManager, IRegistry < ModelResourceLocation , IBakedModel > modelRegistry, ModelLoader modelLoader)`

## Methods

- `public ModelManager getModelManager()`
- `public IRegistry < ModelResourceLocation , IBakedModel > getModelRegistry()`
- `public ModelLoader getModelLoader()`

## Description

Fired when the ModelManager is notified of the resource manager reloading. Called after model registry is setup, but before it's passed to BlockModelShapes.
