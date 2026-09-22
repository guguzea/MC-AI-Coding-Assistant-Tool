---
title: "AttributeMap"
description: "public class AttributeMap extends AbstractAttributeMap"
package: "net/minecraft/entity/ai/attributes"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/ai/attributes/AttributeMap.html"
sourceType: javadoc
---

# AttributeMap

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.attributes.AbstractAttributeMap → net.minecraft.entity.ai.attributes.AttributeMap

## Class signature

```java
public class AttributeMap extends AbstractAttributeMap
```

## Constructors

- `AttributeMap()`

## Methods

- `protected IAttributeInstance createInstance(IAttribute attribute)`
- `ModifiableAttributeInstance getAttributeInstance(IAttribute attribute)`
- `ModifiableAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `java.util.Set<IAttributeInstance> getAttributeInstanceSet()`
- `java.util.Collection<IAttributeInstance> getWatchedAttributes()`
- `void onAttributeModified(IAttributeInstance instance)`
- `IAttributeInstance registerAttribute(IAttribute attribute)`

## Fields

- `protected java.util.Map<java.lang.String, IAttributeInstance> descriptionToAttributeInstanceMap`
