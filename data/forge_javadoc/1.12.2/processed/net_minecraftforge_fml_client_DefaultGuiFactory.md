# DefaultGuiFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.DefaultGuiFactory

## Class signature

```java
public class DefaultGuiFactory extends java.lang.Object implements IModGuiFactory
```

## Constructors

- `DefaultGuiFactory(java.lang.String modid, java.lang.String title)`

## Methods

- `GuiScreen createConfigGui(GuiScreen parentScreen)` — Return an initialized GuiScreen .
- `static IModGuiFactory forMod(ModContainer mod)`
- `boolean hasConfigGui()` — If this method returns false, the config button in the mod list will be disabled
- `void initialize(Minecraft minecraftInstance)` — Called when instantiated to initialize with the active minecraft instance.
- `java.util.Set<IModGuiFactory.RuntimeOptionCategoryElement> runtimeGuiCategories()` — Return a list of the "runtime" categories this mod wishes to populate with GUI elements.

## Fields

- `protected Minecraft minecraft`
- `protected java.lang.String modid`
- `protected java.lang.String title`