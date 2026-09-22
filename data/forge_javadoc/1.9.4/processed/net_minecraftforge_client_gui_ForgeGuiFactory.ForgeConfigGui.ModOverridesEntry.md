# ForgeGuiFactory.ForgeConfigGui.ModOverridesEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiConfigEntries.ListEntryBase → net.minecraftforge.fml.client.config.GuiConfigEntries.CategoryEntry → net.minecraftforge.client.gui.ForgeGuiFactory.ForgeConfigGui.ModOverridesEntry

## Class signature

```java
public static class ForgeGuiFactory.ForgeConfigGui.ModOverridesEntry extends GuiConfigEntries.CategoryEntry
```

## Methods

- `protected GuiScreen buildChildScreen()` — This method is called in the constructor and is used to set the childScreen field.
- `boolean enabled()` — By overriding the enabled() method and checking the value of the "enabled" entry this entry is enabled/disabled based on the value of the other entry.
- `boolean isChanged()` — Check to see if the child screen's entry list has changed.
- `void undoChanges()` — Since adding a new entry to the child screen is what constitutes a change here, reset the child screen listEntries to the saved list.

## Fields

- `ModOverridesEntry`