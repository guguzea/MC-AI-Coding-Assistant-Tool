# Advancement

## Class signature

```java
public class Advancement extends java.lang.Object
```

## Constructors

- `public Advancement( ResourceLocation id, Advancement parentIn, DisplayInfo displayIn, AdvancementRewards rewardsIn, java.util.Map<java.lang.String, Criterion > criteriaIn, java.lang.String[][] requirementsIn)`

## Methods

- `public Advancement.Builder copy()`
- `public Advancement getParent()`
- `public DisplayInfo getDisplay()`
- `public AdvancementRewards getRewards()`
- `public java.lang.String toString()`
- `public java.lang.Iterable< Advancement > getChildren()`
- `public java.util.Map<java.lang.String, Criterion > getCriteria()`
- `public int getRequirementCount()`
- `public void addChild( Advancement advancementIn)`
- `public ResourceLocation getId()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public java.lang.String[][] getRequirements()`
- `public ITextComponent getDisplayText()`