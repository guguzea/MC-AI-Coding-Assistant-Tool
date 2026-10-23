---
title: "org.bukkit.inventory.MenuType"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.inventory.MenuType extends org.bukkit.Keyed,org.bukkit.registry.RegistryAware`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X1`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X2`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X3`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X4`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X5`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_9X6`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> GENERIC_3X3`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.CrafterView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.CrafterView>> CRAFTER_3X3`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.AnvilView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.AnvilView>> ANVIL`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.BeaconView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.BeaconView>> BEACON`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.FurnaceView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.FurnaceView>> BLAST_FURNACE`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.BrewingStandView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.BrewingStandView>> BREWING_STAND`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> CRAFTING`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.EnchantmentView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.EnchantmentView>> ENCHANTMENT`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.FurnaceView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.FurnaceView>> FURNACE`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> GRINDSTONE`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> HOPPER`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.LecternView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.LecternView>> LECTERN`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.LoomView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.LoomView>> LOOM`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.MerchantView, org.bukkit.inventory.view.builder.MerchantInventoryViewBuilder<org.bukkit.inventory.view.MerchantView>> MERCHANT`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> SHULKER_BOX`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> SMITHING`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.FurnaceView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.FurnaceView>> SMOKER`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.InventoryView>> CARTOGRAPHY_TABLE`
- `public static final org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.view.StonecutterView, org.bukkit.inventory.view.builder.LocationInventoryViewBuilder<org.bukkit.inventory.view.StonecutterView>> STONECUTTER`
- `public abstract org.bukkit.inventory.MenuType$Typed<org.bukkit.inventory.InventoryView, org.bukkit.inventory.view.builder.InventoryViewBuilder<org.bukkit.inventory.InventoryView>> typed()`
- `public abstract <V extends org.bukkit.inventory.InventoryView, B extends org.bukkit.inventory.view.builder.InventoryViewBuilder<V>> org.bukkit.inventory.MenuType$Typed<V, B> typed(java.lang.Class<V>) throws java.lang.IllegalArgumentException`
- `public abstract java.lang.Class<? extends org.bukkit.inventory.InventoryView> getInventoryViewClass()`
- `public abstract org.bukkit.NamespacedKey getKey()`
