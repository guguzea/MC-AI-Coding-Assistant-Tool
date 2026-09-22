# TileEntityBanner.EnumBannerPattern

**Inheritance:** java.lang.Object → java.lang.Enum<TileEntityBanner.EnumBannerPattern> → net.minecraft.tileentity.TileEntityBanner.EnumBannerPattern

## Class signature

```java
public static enum TileEntityBanner.EnumBannerPattern extends java.lang.Enum<TileEntityBanner.EnumBannerPattern>
```

## Methods

- `java.lang.String[] getCraftingLayers()` — Retrieves the string array which represents the associated crafting recipe for this banner effect.
- `ItemStack getCraftingStack()` — Retrieves the ItemStack associated with the crafting of this pattern.
- `static TileEntityBanner.EnumBannerPattern getPatternByID(java.lang.String id)` — Retrieves an instance of a banner pattern by its short string id.
- `java.lang.String getPatternID()` — Retrieves the short string used to represent this pattern.
- `java.lang.String getPatternName()` — Retrieves the name used to represent this pattern.
- `boolean hasCraftingStack()` — Checks to see if this pattern has a specific ItemStack associated with it's crafting.
- `boolean hasValidCrafting()` — Checks to see if this pattern has a valid crafting stack, or if the top crafting layer is not null.
- `static TileEntityBanner.EnumBannerPattern valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static TileEntityBanner.EnumBannerPattern [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.