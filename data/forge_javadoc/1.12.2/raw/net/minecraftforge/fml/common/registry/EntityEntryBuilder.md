---
title: "EntityEntryBuilder"
description: "public final class EntityEntryBuilder<E extends Entity> extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/EntityEntryBuilder.html"
sourceType: javadoc
---

# EntityEntryBuilder

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.EntityEntryBuilder<E>

## Class signature

```java
public final class EntityEntryBuilder<E extends Entity> extends java.lang.Object
```

## Methods

- `EntityEntry build()` — Create an entity entry based on the data in this builder.
- `static<E extends Entity> EntityEntryBuilder<E> create()` — Creates a new entity entry builder.
- `EntityEntryBuilder<E> egg(int primaryColor, int secondaryColor)` — Sets the egg of the entity.
- `EntityEntryBuilder<E> entity(java.lang.Class<? extends E> entity)` — Sets the class of the entity.
- `EntityEntryBuilder<E> factory(java.util.function.Function<World, E> factory)` — Sets the factory of the entity.
- `EntityEntryBuilder<E> id(ResourceLocation id, int network)` — Sets the id of the entity.
- `EntityEntryBuilder<E> id(java.lang.String id, int network)` — Sets the id of the entity.
- `EntityEntryBuilder<E> name(java.lang.String name)` — Sets the name of the entity.
- `EntityEntryBuilder<E> spawn(EnumCreatureType type, int weight, int min, int max, Biome ... biomes)` — Adds a spawn entry.
- `EntityEntryBuilder<E> spawn(EnumCreatureType type, int weight, int min, int max, java.lang.Iterable<Biome> biomes)` — Adds a spawn entry.
- `EntityEntryBuilder<E> tracker(int range, int updateFrequency, boolean sendVelocityUpdates)` — Sets entity tracking information.
