---
title: "ICriterionTrigger"
description: "public interface ICriterionTrigger<T extends ICriterionInstance >"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/ICriterionTrigger.html"
sourceType: javadoc
---

# ICriterionTrigger

## Class signature

```java
public interface ICriterionTrigger<T extends ICriterionInstance >
```

## Methods

- `ResourceLocation getId()`
- `void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < T > listener)`
- `void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < T > listener)`
- `void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `T deserializeInstance(JsonObject json, JsonDeserializationContext context)`
