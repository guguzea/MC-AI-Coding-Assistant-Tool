# MultiModelState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.MultiModelState

## Class signature

```java
public final class MultiModelState extends java.lang.Object implements IModelState
```

## Constructors

- `MultiModelState(com.google.common.collect.ImmutableList<org.apache.commons.lang3.tuple.Pair<M, S>> states)`

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`
- `static IModelState getPartState(IModelState state, IModel model, int index)`