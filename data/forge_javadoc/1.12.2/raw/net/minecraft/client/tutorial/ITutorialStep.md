---
title: "ITutorialStep"
description: "public interface ITutorialStep"
package: "net/minecraft/client/tutorial"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/tutorial/ITutorialStep.html"
sourceType: javadoc
---

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
