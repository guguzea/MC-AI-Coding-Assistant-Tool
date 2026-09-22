# Tutorial

**Inheritance:** java.lang.Object → net.minecraft.client.tutorial.Tutorial

## Class signature

```java
public class Tutorial extends java.lang.Object
```

## Constructors

- `Tutorial(Minecraft minecraft)`

## Methods

- `static ITextComponent createKeybindComponent(java.lang.String keybind)`
- `GameType getGameType()`
- `Minecraft getMinecraft()`
- `void handleMouse(MouseHelper p_193299_1_)`
- `void handleMovement(MovementInput p_193293_1_)`
- `void handleSetSlot(ItemStack stack)`
- `void onHitBlock(WorldClient worldIn, BlockPos pos, IBlockState state, float diggingStage)`
- `void onMouseHover(WorldClient worldIn, RayTraceResult result)`
- `void openInventory()`
- `void reload()`
- `void setStep(TutorialSteps step)`
- `void stop()`
- `void update()`