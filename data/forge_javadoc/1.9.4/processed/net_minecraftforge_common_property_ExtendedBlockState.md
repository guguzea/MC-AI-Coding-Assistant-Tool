# ExtendedBlockState

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateContainer → net.minecraftforge.common.property.ExtendedBlockState

## Class signature

```java
public class ExtendedBlockState extends BlockStateContainer
```

## Constructors

- `ExtendedBlockState(Block blockIn, IProperty<?>[] properties, IUnlistedProperty<?>[] unlistedProperties)`

## Methods

- `protected BlockStateContainer.StateImplementation createState(Block block, com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> properties, com.google.common.collect.ImmutableMap<IUnlistedProperty<?>, com.google.common.base.Optional<?>> unlistedProperties)`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedProperties()`