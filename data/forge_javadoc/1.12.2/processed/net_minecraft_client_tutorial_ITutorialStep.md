# ITutorialStep

## Class signature

```java
public interface ITutorialStep
```

## Methods

- `default void onStop()`
- `default void update()`
- `default void handleMovement( MovementInput input)`
- `default void handleMouse( MouseHelper mouseHelperIn)`
- `default void onMouseHover( WorldClient worldIn, RayTraceResult result)`
- `default void onHitBlock( WorldClient worldIn, BlockPos pos, IBlockState state, float diggingStage)`
- `default void openInventory()`
- `default void handleSetSlot( ItemStack stack)`