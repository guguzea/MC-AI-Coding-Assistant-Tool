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