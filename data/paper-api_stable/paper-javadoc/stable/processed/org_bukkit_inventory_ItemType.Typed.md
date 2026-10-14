---
title: "org.bukkit.inventory.ItemType.Typed"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/ItemType.Typed.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemType.Typed<M extends ItemMeta>**
`@Experimental @NonExtendable public static interface ItemType.Typed<M extends ItemMeta> extends ItemType`
- `@Experimental Class<M> getItemMetaClass()`
- `@Experimental ItemStack createItemStack(@Nullable Consumer<? super M> metaConfigurator)`
- `@Experimental ItemStack createItemStack(int amount, @Nullable Consumer<? super M> metaConfigurator)`
