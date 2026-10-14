---
title: "io.papermc.paper.datacomponent.item.ItemEnchantments"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemEnchantments.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemEnchantments**
`@NonExtendable public interface ItemEnchantments`
- `@Contract(value="_ -> new", pure=true) static ItemEnchantments itemEnchantments(Map<Enchantment, @IntRange(from=1L,to=255L) Integer> enchantments)`
- `@Contract(value="-> new", pure=true) static ItemEnchantments.Builder itemEnchantments()`
- `@Contract(pure=true) @Unmodifiable Map<Enchantment, @IntRange(from=1L,to=255L) Integer> enchantments()`
