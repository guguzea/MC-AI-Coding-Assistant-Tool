---
title: "AttributeMap"
description: "public class AttributeMap extends AbstractAttributeMap"
package: "net/minecraft/entity/ai/attributes"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/attributes/AttributeMap.html"
sourceType: javadoc
---

# AttributeMap

## Class signature

```java
public class AttributeMap extends AbstractAttributeMap
```

## Constructors

- `public AttributeMap()`

## Methods

- `public ModifiableAttributeInstance getAttributeInstance( IAttribute attribute)`
- `public ModifiableAttributeInstance getAttributeInstanceByName(java.lang.String attributeName)`
- `public IAttributeInstance registerAttribute( IAttribute attribute)`
- `protected IAttributeInstance createInstance( IAttribute attribute)`
- `public void onAttributeModified( IAttributeInstance instance)`
- `public java.util.Set< IAttributeInstance > getAttributeInstanceSet()`
- `public java.util.Collection< IAttributeInstance > getWatchedAttributes()`
