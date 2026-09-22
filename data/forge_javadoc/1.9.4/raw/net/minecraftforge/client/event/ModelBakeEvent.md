---
title: "ModelBakeEvent"
description: "public class ModelBakeEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/event/ModelBakeEvent.html"
sourceType: javadoc
---

# ModelBakeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.ModelBakeEvent

## Class signature

```java
public class ModelBakeEvent extends Event
```

## Constructors

- `ModelBakeEvent(ModelManager modelManager, IRegistry<ModelResourceLocation, IBakedModel> modelRegistry, ModelLoader modelLoader)`

## Methods

- `ModelLoader getModelLoader()`
- `ModelManager getModelManager()`
- `IRegistry<ModelResourceLocation, IBakedModel> getModelRegistry()`
