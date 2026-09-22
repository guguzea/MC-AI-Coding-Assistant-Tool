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
- `void renderItemInFirstPerson(AbstractClientPlayer p_187457_1_, float p_187457_2_, float p_187457_3_, EnumHand p_187457_4_, float p_187457_5_, ItemStack p_187457_6_, float p_187457_7_)`
- `void renderItemInFirstPerson(float partialTicks)`
- `void renderItemSide(EntityLivingBase entitylivingbaseIn, ItemStack heldStack, ItemCameraTransforms.TransformType transform, boolean leftHanded)`
- `void renderOverlays(float partialTicks)`
- `void resetEquippedProgress(EnumHand hand)`
- `void updateEquippedItem()`