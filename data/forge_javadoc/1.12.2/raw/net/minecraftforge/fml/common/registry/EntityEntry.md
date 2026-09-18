---
title: "EntityEntry"
description: "public class EntityEntry extends IForgeRegistryEntry.Impl < EntityEntry >"
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/EntityEntry.html"
sourceType: javadoc
---

# EntityEntry

## Class signature

```java
public class EntityEntry extends IForgeRegistryEntry.Impl < EntityEntry >
```

## Constructors

- `public EntityEntry(java.lang.Class<? extends Entity > cls, java.lang.String name)`

## Methods

- `protected void init()`
- `public java.lang.Class<? extends Entity > getEntityClass()`
- `public java.lang.String getName()`
- `public EntityList.EntityEggInfo getEgg()`
- `public void setEgg( EntityList.EntityEggInfo egg)`
- `public Entity newInstance( World world)`
