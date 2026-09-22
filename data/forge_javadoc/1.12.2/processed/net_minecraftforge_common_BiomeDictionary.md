# BiomeDictionary

**Inheritance:** java.lang.Object → net.minecraftforge.common.BiomeDictionary

## Class signature

```java
public class BiomeDictionary extends java.lang.Object
```

## Constructors

- `BiomeDictionary()`

## Methods

- `static void addTypes(Biome biome, BiomeDictionary.Type ... types)` — Adds the given types to the biome.
- `static boolean areSimilar(Biome biomeA, Biome biomeB)` — Checks if the two given biomes have types in common.
- `static java.util.Set<Biome> getBiomes(BiomeDictionary.Type type)` — Gets the set of biomes that have the given type.
- `static java.util.Set<BiomeDictionary.Type> getTypes(Biome biome)` — Gets the set of types that have been added to the given biome.
- `static boolean hasAnyType(Biome biome)` — Checks if any type has been added to the given biome.
- `static boolean hasType(Biome biome, BiomeDictionary.Type type)` — Checks if the given type has been added to the given biome.
- `static void makeBestGuess(Biome biome)` — Automatically adds appropriate types to a given biome based on certain heuristics.