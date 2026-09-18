# FMLConfigGuiFactory

## Class signature

```java
public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `public FMLConfigGuiFactory()`

## Methods

- `public void initialize( Minecraft minecraftInstance)`
- `public java.lang.Class<? extends GuiScreen > mainConfigGuiClass()`
- `public java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `public IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor( IModGuiFactory.RuntimeOptionCategoryElement element)`

## Description

Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement .