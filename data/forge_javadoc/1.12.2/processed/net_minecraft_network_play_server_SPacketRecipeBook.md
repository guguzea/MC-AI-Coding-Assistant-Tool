# SPacketRecipeBook

## Class signature

```java
public class SPacketRecipeBook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketRecipeBook()`
- `public SPacketRecipeBook( SPacketRecipeBook.State stateIn, java.util.List< IRecipe > recipesIn, java.util.List< IRecipe > displayedRecipesIn, boolean isGuiOpen, boolean p_i47597_5_)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.util.List< IRecipe > getRecipes()`
- `public java.util.List< IRecipe > getDisplayedRecipes()`
- `public boolean isGuiOpen()`
- `public boolean isFilteringCraftable()`
- `public SPacketRecipeBook.State getState()`