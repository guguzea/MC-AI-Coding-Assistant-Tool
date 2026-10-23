---
title: "io.papermc.paper.datacomponent.item.ItemEnchantments"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/ItemEnchantments.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_, _ -> new", pure=true) static ItemEnchantments itemEnchantments(Map<Enchantment,@IntRange(from=1L,to=255L) Integer> enchantments, boolean showInTooltip)`
- `@Contract(value="-> new", pure=true) static ItemEnchantments.Builder itemEnchantments()`
- `@Contract(pure=true) @Unmodifiable Map<Enchantment,@IntRange(from=1L,to=255L) Integer> enchantments()`
