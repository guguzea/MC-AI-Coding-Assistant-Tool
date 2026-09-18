# ForgeGuiFactory

## Class signature

```java
public class ForgeGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `public ForgeGuiFactory()`

## Methods

- `public void initialize( Minecraft minecraftInstance)`
- `public boolean hasConfigGui()`
- `public GuiScreen createConfigGui( GuiScreen parent)`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`

## Description

This is the base GuiConfig screen class that all the other Forge-specific config screens will be called from. Since Forge has multiple config files I thought I would use that opportunity to show some