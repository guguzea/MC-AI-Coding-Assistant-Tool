# AdvancementProgress

## Class signature

```java
public class AdvancementProgress extends java.lang.Object implements java.lang.Comparable< AdvancementProgress >
```

## Constructors

- `public AdvancementProgress()`

## Methods

- `public void update(java.util.Map<java.lang.String, Criterion > criteriaIn, java.lang.String[][] requirements)`
- `public boolean isDone()`
- `public boolean hasProgress()`
- `public boolean grantCriterion(java.lang.String criterionIn)`
- `public boolean revokeCriterion(java.lang.String criterionIn)`
- `public java.lang.String toString()`
- `public void serializeToNetwork( PacketBuffer p_192104_1_)`
- `public static AdvancementProgress fromNetwork( PacketBuffer p_192100_0_)`
- `public CriterionProgress getCriterionProgress(java.lang.String criterionIn)`
- `public float getPercent()`
- `public java.lang.String getProgressText()`
- `public java.lang.Iterable<java.lang.String> getRemaningCriteria()`
- `public java.lang.Iterable<java.lang.String> getCompletedCriteria()`
- `public java.util.Date getFirstProgressDate()`
- `public int compareTo( AdvancementProgress p_compareTo_1_)`