---
title: "ItemDurabilityTrigger"
description: "public class ItemDurabilityTrigger extends java.lang.Object implements ICriterionTrigger<ItemDurabilityTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ItemDurabilityTrigger.html"
sourceType: javadoc
---

# ItemDurabilityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ItemDurabilityTrigger

## Class signature

```java
public class ItemDurabilityTrigger extends java.lang.Object implements ICriterionTrigger<ItemDurabilityTrigger.Instance>
```

## Constructors

- `ItemDurabilityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ItemDurabilityTrigger.Instance> listener)`
- `ItemDurabilityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ItemDurabilityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack itemIn, int newDurability)`
