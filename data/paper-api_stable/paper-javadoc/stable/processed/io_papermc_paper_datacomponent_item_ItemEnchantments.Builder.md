---
title: "io.papermc.paper.datacomponent.item.ItemEnchantments.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemEnchantments.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemEnchantments.Builder**
`@NonExtendable public static interface ItemEnchantments.Builder extends DataComponentBuilder<ItemEnchantments>`
- `@Contract(value="_, _ -> this", mutates="this") ItemEnchantments.Builder add(Enchantment enchantment, @IntRange(from=1L,to=255L) int level)`
- `@Contract(value="_ -> this", mutates="this") ItemEnchantments.Builder addAll(Map<Enchantment, @IntRange(from=1L,to=255L) Integer> enchantments)`
