# Advancement

**Inheritance:** java.lang.Object → net.minecraft.advancements.Advancement

## Class signature

```java
public class Advancement extends java.lang.Object
```

## Constructors

- `Advancement(ResourceLocation id, Advancement parentIn, DisplayInfo displayIn, AdvancementRewards rewardsIn, java.util.Map<java.lang.String, Criterion> criteriaIn, java.lang.String[][] requirementsIn)`

## Methods

- `void addChild(Advancement advancementIn)`
- `Advancement.Builder copy()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.Iterable<Advancement> getChildren()`
- `java.util.Map<java.lang.String, Criterion> getCriteria()`
- `DisplayInfo getDisplay()`
- `ITextComponent getDisplayText()`
- `ResourceLocation getId()`
- `Advancement getParent()`
- `int getRequirementCount()`
- `java.lang.String[][] getRequirements()`
- `AdvancementRewards getRewards()`
- `int hashCode()`
- `java.lang.String toString()`