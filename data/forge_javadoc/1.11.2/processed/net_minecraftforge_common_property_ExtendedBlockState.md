# ExtendedBlockState

## Class signature

```java
public class ExtendedBlockState extends BlockStateContainer
```

## Constructors

- `public ExtendedBlockState( Block blockIn, IProperty <?>[] properties, IUnlistedProperty <?>[] unlistedProperties)`

## Methods

- `public java.util.Collection< IUnlistedProperty <?>> getUnlistedProperties()`
- `@Nonnull protected BlockStateContainer.StateImplementation createState(@Nonnull Block block, @Nonnull com.google.common.collect.ImmutableMap< IProperty <?>,java.lang.Comparable<?>> properties, @Nullable com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> unlistedProperties)`