# SimpleModelState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.SimpleModelState

## Class signature

```java
public final class SimpleModelState extends java.lang.Object implements IModelState
```

## Constructors

- `SimpleModelState(com.google.common.collect.ImmutableMap<? extends IModelPart, TRSRTransformation> map)`
- `SimpleModelState(com.google.common.collect.ImmutableMap<? extends IModelPart, TRSRTransformation> map, com.google.common.base.Optional<TRSRTransformation> def)`

## Methods

- `com.google.common.base.Optional<TRSRTransformation> apply(com.google.common.base.Optional<? extends IModelPart> part)`