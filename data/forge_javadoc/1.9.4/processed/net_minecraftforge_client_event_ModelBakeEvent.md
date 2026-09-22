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