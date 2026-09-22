# SPacketRecipeBook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRecipeBook

## Class signature

```java
public class SPacketRecipeBook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRecipeBook()`
- `SPacketRecipeBook(SPacketRecipeBook.State stateIn, java.util.List<IRecipe> recipesIn, java.util.List<IRecipe> displayedRecipesIn, boolean isGuiOpen, boolean p_i47597_5_)`

## Methods

- `java.util.List<IRecipe> getDisplayedRecipes()`
- `java.util.List<IRecipe> getRecipes()`
- `SPacketRecipeBook.State getState()`
- `boolean isFilteringCraftable()`
- `boolean isGuiOpen()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`