# CloudRenderer

**Inheritance:** java.lang.Object → net.minecraftforge.client.CloudRenderer

## Class signature

```java
public class CloudRenderer extends java.lang.Object implements ISelectiveResourceReloadListener
```

## Constructors

- `CloudRenderer()`

## Methods

- `void checkSettings()`
- `void onResourceManagerReload(IResourceManager resourceManager, java.util.function.Predicate<IResourceType> resourcePredicate)` — A version of onResourceManager that selectively chooses IResourceType s to reload.
- `boolean render(int cloudTicks, float partialTicks)`