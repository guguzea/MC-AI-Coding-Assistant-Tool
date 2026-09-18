---
title: "ModelBakeEvent"
description: "Fired when the ModelManager is notified of the resource manager reloading. Called after model registry is setup, but before it's passed to BlockModelShapes."
package: "net/minecraftforge/client/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/event/ModelBakeEvent.html"
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

- `@Deprecated public ModelBakeEvent( ModelManager modelManager, IRegistry < ModelResourceLocation , IBakedModel > modelRegistry, ModelBakery modelBakery)`

## Description

Fired when the ModelManager is notified of the resource manager reloading. Called after model registry is setup, but before it's passed to BlockModelShapes.
