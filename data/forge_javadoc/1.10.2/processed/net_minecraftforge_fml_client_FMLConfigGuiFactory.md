# FMLConfigGuiFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.FMLConfigGuiFactory

## Class signature

```java
public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `FMLConfigGuiFactory()`

## Methods

- `IModGuiFactory.RuntimeOptionGuiHandler getHandlerFor(IModGuiFactory.RuntimeOptionCategoryElement element)` — Return an instance of a IModGuiFactory.RuntimeOptionGuiHandler that handles painting the right hand side option screen for the specified IModGuiFactory.RuntimeOptionCategoryElement .
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.lang.Class<? extends GuiScreen> mainConfigGuiClass()` — Return the name of a class extending GuiScreen .
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.