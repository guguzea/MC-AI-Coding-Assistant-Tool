# IModGuiFactory

## Class signature

```java
public interface IModGuiFactory
```

## Methods

- `void initialize( Minecraft minecraftInstance)`
- `boolean hasConfigGui()`
- `GuiScreen createConfigGui( GuiScreen parentScreen)`
- `java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`

## Description

This is the interface you need to implement if you want to provide a customized config screen. DefaultGuiFactory provides a default implementation of this interface and will be used if the mod does no