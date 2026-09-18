# IModGuiFactory

## Class signature

```java
public interface IModGuiFactory
```

## Methods

- `void initialize( Minecraft minecraftInstance)`
- `java.lang.Class<? extends GuiScreen > mainConfigGuiClass()`
- `java.util.Set< IModGuiFactory.RuntimeOptionCategoryElement > runtimeGuiCategories()`
- `@Nullable IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor( IModGuiFactory.RuntimeOptionCategoryElement element)`

## Description

Represents an option category and entry in the runtime gui options list.