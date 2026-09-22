---
title: "ModifiableAttributeInstance"
description: "public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance"
package: "net/minecraft/entity/ai/attributes"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/ai/attributes/ModifiableAttributeInstance.html"
sourceType: javadoc
---

# ModifiableAttributeInstance

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.ModifiableAttributeInstance

## Class signature

```java
public class ModifiableAttributeInstance extends java.lang.Object implements IAttributeInstance
```

## Constructors

- `ModifiableAttributeInstance(AbstractAttributeMap attributeMapIn, IAttribute genericAttributeIn)`

## Methods

- `void applyModifier(AttributeModifier modifier)`
- `protected void flagForUpdate()`
- `IAttribute getAttribute()`
- `double getAttributeValue()`
- `double getBaseValue()`
- `AttributeModifier getModifier(java.util.UUID uuid)`
- `java.util.Collection<AttributeModifier> getModifiers()`
- `java.util.Collection<AttributeModifier> getModifiersByOperation(int operation)`
- `boolean hasModifier(AttributeModifier modifier)`
- `void removeAllModifiers()`
- `void removeModifier(AttributeModifier modifier)`
- `void removeModifier(java.util.UUID p_188479_1_)`
- `void setBaseValue(double baseValue)`
