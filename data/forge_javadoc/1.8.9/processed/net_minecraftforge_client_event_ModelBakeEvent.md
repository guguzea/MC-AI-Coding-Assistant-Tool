# ModelBakeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.ModelBakeEvent

## Class signature

```java
public class ModelBakeEvent extends Event
```

## Constructors

- `@Deprecated ModelBakeEvent(ModelManager modelManager, IRegistry<ModelResourceLocation, IBakedModel> modelRegistry, ModelBakery modelBakery)`
- `ModelBakeEvent(ModelManager modelManager, IRegistry<ModelResourceLocation, IBakedModel> modelRegistry, ModelLoader modelLoader)`

## Fields

- `ModelBakery modelBakery`
- `ModelLoader modelLoader`
- `ModelManager modelManager`
- `IRegistry<ModelResourceLocation, IBakedModel> modelRegistry`