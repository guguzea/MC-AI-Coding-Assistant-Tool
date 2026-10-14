---
title: "org.bukkit.inventory.MenuType.Typed"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/MenuType.Typed.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MenuType.Typed<V extends InventoryView, B extends InventoryViewBuilder<V>>**
`public static interface MenuType.Typed<V extends InventoryView, B extends InventoryViewBuilder<V>> extends MenuType`
- `default V create(HumanEntity player)`
- `@Deprecated(since="1.21") V create(HumanEntity player, @Nullable String title)`
- `V create(HumanEntity player, @Nullable Component title)`
- `B builder()`
