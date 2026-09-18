# MultiModelState

## Class signature

```java
public final class MultiModelState extends java.lang.Object implements IModelState
```

## Constructors

- `public MultiModelState(com.google.common.collect.ImmutableList<org.apache.commons.lang3.tuple.Pair<M,S>> states)`

## Methods

- `public static IModelState getPartState( IModelState state, IModel model, int index)`
- `public com.google.common.base.Optional< TRSRTransformation > apply(com.google.common.base.Optional<? extends IModelPart > part)`