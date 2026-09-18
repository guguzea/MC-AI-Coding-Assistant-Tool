# DefaultGuiFactory

## Class signature

```java
public class DefaultGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `protected DefaultGuiFactory(java.lang.String modid, java.lang.String title)`

## Methods

- `public boolean hasConfigGui()`
- `public void initialize( Minecraft minecraftInstance)`
- `public GuiScreen createConfigGui( GuiScreen parentScreen)`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `public static IModGuiFactory forMod( ModContainer mod)`

## Description

Return an initialized GuiScreen .