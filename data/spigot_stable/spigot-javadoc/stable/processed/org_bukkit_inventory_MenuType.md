---
title: "org.bukkit.inventory.MenuType"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/MenuType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MenuType**
`@Experimental public interface MenuType extends Keyed, RegistryAware`
- `static final MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> GENERIC_9X1`
- `static final MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> GENERIC_9X2`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> GENERIC_9X3`
- `static final MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> GENERIC_9X4`
- `static final MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> GENERIC_9X5`
- `static final MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> GENERIC_9X6`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> GENERIC_3X3`
- `static final MenuType.Typed<CrafterView, LocationInventoryViewBuilder<CrafterView>> CRAFTER_3X3`
- `static final MenuType.Typed<AnvilView, LocationInventoryViewBuilder<AnvilView>> ANVIL`
- `static final MenuType.Typed<BeaconView, LocationInventoryViewBuilder<BeaconView>> BEACON`
- `static final MenuType.Typed<FurnaceView, LocationInventoryViewBuilder<FurnaceView>> BLAST_FURNACE`
- `static final MenuType.Typed<BrewingStandView, LocationInventoryViewBuilder<BrewingStandView>> BREWING_STAND`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> CRAFTING`
- `static final MenuType.Typed<EnchantmentView, LocationInventoryViewBuilder<EnchantmentView>> ENCHANTMENT`
- `static final MenuType.Typed<FurnaceView, LocationInventoryViewBuilder<FurnaceView>> FURNACE`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> GRINDSTONE`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> HOPPER`
- `static final MenuType.Typed<LecternView, LocationInventoryViewBuilder<LecternView>> LECTERN`
- `static final MenuType.Typed<LoomView, LocationInventoryViewBuilder<LoomView>> LOOM`
- `static final MenuType.Typed<MerchantView, MerchantInventoryViewBuilder<MerchantView>> MERCHANT`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> SHULKER_BOX`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> SMITHING`
- `static final MenuType.Typed<FurnaceView, LocationInventoryViewBuilder<FurnaceView>> SMOKER`
- `static final MenuType.Typed<InventoryView, LocationInventoryViewBuilder<InventoryView>> CARTOGRAPHY_TABLE`
- `static final MenuType.Typed<StonecutterView, LocationInventoryViewBuilder<StonecutterView>> STONECUTTER`
- `@NotNull MenuType.Typed<InventoryView, InventoryViewBuilder<InventoryView>> typed()`
- `@NotNull <V extends InventoryView, B extends InventoryViewBuilder<V>> MenuType.Typed<V,B> typed(@NotNull Class<V> viewClass) throws IllegalArgumentException`
- `@NotNull Class<? extends InventoryView> getInventoryViewClass()`
- `@NotNull @Deprecated(since="1.21.4") NamespacedKey getKey()`
