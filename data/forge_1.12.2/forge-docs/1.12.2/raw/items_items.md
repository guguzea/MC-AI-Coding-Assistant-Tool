---
version: "1.12.2"
forgeVersion: "14.23.5.2858"
chapter: "items/items"
source: "https://docs.readthedocs.net/en/1.12.x/items/items/"
sourceType: mkdocs
---
# Items

Along with blocks, items are a key component of most mods. While blocks make up the world around you, items are what let you change it.

## Creating an Item

### Basic Items

Basic items that need no special functionality (think sticks or sugar) don&rsquo;t need custom classes. You can simply instantiate `Item` and call its various setters to set some simple properties.

Method | Description
--- | ---
`setCreativeTab` | Sets which creative tab this item is under. Must be called if this item is meant to be shown on the creative menu. Vanilla tabs can be found in the class `CreativeTabs`.
`setMaxDamage` | Sets the maximum damage value for this item. If it&rsquo;s over `0`, 2 item properties &ldquo;damaged&rdquo; and &ldquo;damage&rdquo; are added.
`setMaxStackSize` | Sets the maximum stack size.
`setNoRepair` | Makes this item impossible to repair, even if it is damageable.
`setUnlocalizedName` | Sets this item&rsquo;s unlocalized name, with &ldquo;item.&rdquo; prepended.
`setHarvestLevel` | Adds or removes a pair of harvest class (`"shovel"`, `"axe"`) and harvest level. This method is not chainable.

The above methods are chainable, unless otherwise stated, meaning they `return this` to facilitate calling them in series.

### Advanced Items

Setting the properties of an item as above only works for simple items. If you want more complicated items, you should subclass `Item` and override its methods.

## Registering an Item

Items must be [registered](../../concepts/registries/#registering-things) to function.