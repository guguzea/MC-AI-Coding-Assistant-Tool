# ItemRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.ItemRenderer

## Class signature

```java
public class ItemRenderer extends java.lang.Object
```

## Constructors

- `ItemRenderer(Minecraft mcIn)`

## Methods

- `void renderItem(EntityLivingBase entityIn, ItemStack heldStack, ItemCameraTransforms.TransformType transform)`
- `void renderItemInFirstPerson(float partialTicks)` — Renders the active item in the player's hand when in first person mode.
- `void renderOverlays(float partialTicks)` — Renders all the overlays that are in first person mode.
- `void resetEquippedProgress()` — Resets equippedProgress
- `void resetEquippedProgress2()` — Resets equippedProgress
- `void updateEquippedItem()`