# GuiRecipeBook

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.recipebook.GuiRecipeBook

## Class signature

```java
public class GuiRecipeBook extends Gui implements IRecipeUpdateListener
```

## Constructors

- `GuiRecipeBook()`

## Methods

- `void func_194303_a(int p_194303_1_, int p_194303_2_, Minecraft p_194303_3_, boolean p_194303_4_, InventoryCrafting p_194303_5_)`
- `boolean hasClickedOutside(int p_193955_1_, int p_193955_2_, int p_193955_3_, int p_193955_4_, int p_193955_5_, int p_193955_6_)`
- `void initVisuals(boolean p_193014_1_, InventoryCrafting p_193014_2_)`
- `boolean isVisible()`
- `boolean keyPressed(char typedChar, int keycode)`
- `boolean mouseClicked(int p_191862_1_, int p_191862_2_, int p_191862_3_)`
- `void recipesShown(java.util.List<IRecipe> recipes)`
- `void recipesUpdated()`
- `void removed()`
- `void render(int mouseX, int mouseY, float partialTicks)`
- `void renderGhostRecipe(int p_191864_1_, int p_191864_2_, boolean p_191864_3_, float p_191864_4_)`
- `void renderTooltip(int p_191876_1_, int p_191876_2_, int p_191876_3_, int p_191876_4_)`
- `void setupGhostRecipe(IRecipe p_193951_1_, java.util.List<Slot> p_193951_2_)`
- `void slotClicked(Slot slotIn)`
- `void tick()`
- `void toggleVisibility()`
- `int updateScreenPosition(boolean p_193011_1_, int p_193011_2_, int p_193011_3_)`

## Fields

- `protected static ResourceLocation RECIPE_BOOK`