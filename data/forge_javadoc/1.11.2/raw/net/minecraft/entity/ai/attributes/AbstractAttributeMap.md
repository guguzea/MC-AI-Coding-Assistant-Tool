---
title: "AbstractAttributeMap"
description: "public abstract class AbstractAttributeMap extends java.lang.Object"
package: "net/minecraft/entity/ai/attributes"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/ai/attributes/AbstractAttributeMap.html"
sourceType: javadoc
---

# AbstractAttributeMap

## Class signature

```java
public abstract class AbstractAttributeMap extends java.lang.Object
```

## Constructors

- `public AbstractAttributeMap()`

## Methods

- `public IAttributeInstance getAttributeInstance( IAttribute attribute)`
- `@Nullable public IAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected abstract IAttributeInstance createInstance( IAttribute attribute)`
- `public java.util.Collection< IAttributeInstance > getAllAttributes()`
- `public void onAttributeModified( IAttributeInstance instance)`
- `public void removeAttributeModifiers(com.google.common.collect.Multimap<java.lang.String, AttributeModifier > modifiers)`
- `public void applyAttributeModifiers(com.google.common.collect.Multimap<java.lang.String, AttributeModifier > modifiers)`
