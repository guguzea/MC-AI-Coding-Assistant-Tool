# StateMap.Builder

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.statemap.StateMap.Builder

## Class signature

```java
public static class StateMap.Builder extends java.lang.Object
```

## Constructors

- `Builder()`

## Methods

- `StateMap build()`
- `StateMap.Builder ignore(IProperty<?>... p_178442_1_)` — Add properties that will not be used to compute all possible states of a block, used for block rendering to ignore some property that does not alter block's appearance
- `StateMap.Builder withName(IProperty<?> builderPropertyIn)`
- `StateMap.Builder withSuffix(java.lang.String builderSuffixIn)`