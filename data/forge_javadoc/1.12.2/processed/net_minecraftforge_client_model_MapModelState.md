# MapModelState

## Class signature

```java
public class MapModelState extends java.lang.Object implements IModelState
```

## Constructors

- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map)`
- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map, TRSRTransformation def)`
- `public MapModelState(java.util.Map< MapModelState.Wrapper , IModelState > map, IModelState def)`

## Methods

- `public java.util.Optional< TRSRTransformation > apply(java.util.Optional<? extends IModelPart > part)`
- `public IModelState getState(java.lang.Object obj)`
- `public static MapModelState.Wrapper wrap(java.lang.Object obj)`