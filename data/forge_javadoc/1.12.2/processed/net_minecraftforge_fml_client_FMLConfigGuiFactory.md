# FMLConfigGuiFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.FMLConfigGuiFactory

## Class signature

```java
public class FMLConfigGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `FMLConfigGuiFactory()`

## Methods

- `GuiScreen createConfigGui(GuiScreen parentScreen)` — Return an initialized GuiScreen .
- `boolean hasConfigGui()` — If this method returns false, the config button in the mod list will be disabled
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.