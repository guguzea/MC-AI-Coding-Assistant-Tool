# MapModelState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MapModelState

## Class signature

```java
public class MapModelState extends java.lang.Object implements IModelState
```

## Constructors

- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map)`
- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map, IModelState def)`
- `MapModelState(java.util.Map<MapModelState.Wrapper, IModelState> map, TRSRTransformation def)`

## Methods

- `java.util.Optional<TRSRTransformation> apply(java.util.Optional<? extends IModelPart> part)`
- `IModelState getState(java.lang.Object obj)`
- `static MapModelState.Wrapper wrap(java.lang.Object obj)`