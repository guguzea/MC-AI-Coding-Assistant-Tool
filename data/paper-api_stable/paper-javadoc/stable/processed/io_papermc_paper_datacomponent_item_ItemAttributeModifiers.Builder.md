---
title: "io.papermc.paper.datacomponent.item.ItemAttributeModifiers.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemAttributeModifiers.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemAttributeModifiers.Builder**
`@NonExtendable public static interface ItemAttributeModifiers.Builder extends DataComponentBuilder<ItemAttributeModifiers>`
- `@Contract(value="_, _ -> this", mutates="this") default ItemAttributeModifiers.Builder addModifier(Attribute attribute, AttributeModifier modifier)`
- `@Contract(value="_, _, _ -> this", mutates="this") default ItemAttributeModifiers.Builder addModifier(Attribute attribute, AttributeModifier modifier, EquipmentSlotGroup equipmentSlotGroup)`
- `@Contract(value="_, _, _ -> this", mutates="this") default ItemAttributeModifiers.Builder addModifier(Attribute attribute, AttributeModifier modifier, AttributeModifierDisplay display)`
- `@Contract(value="_, _, _, _ -> this", mutates="this") ItemAttributeModifiers.Builder addModifier(Attribute attribute, AttributeModifier modifier, EquipmentSlotGroup equipmentSlotGroup, AttributeModifierDisplay display)`
