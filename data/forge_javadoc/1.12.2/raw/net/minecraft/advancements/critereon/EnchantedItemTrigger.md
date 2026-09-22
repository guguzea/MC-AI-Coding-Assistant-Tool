---
title: "EnchantedItemTrigger"
description: "public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger<EnchantedItemTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EnchantedItemTrigger.html"
sourceType: javadoc
---

# EnchantedItemTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EnchantedItemTrigger

## Class signature

```java
public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger<EnchantedItemTrigger.Instance>
```

## Constructors

- `EnchantedItemTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnchantedItemTrigger.Instance> listener)`
- `EnchantedItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EnchantedItemTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, ItemStack item, int levelsSpent)`
