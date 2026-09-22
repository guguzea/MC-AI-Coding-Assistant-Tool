# CriterionProgress

**Inheritance:** java.lang.Object → net.minecraft.advancements.CriterionProgress

## Class signature

```java
public class CriterionProgress extends java.lang.Object
```

## Constructors

- `CriterionProgress(AdvancementProgress advancementProgressIn)`

## Methods

- `static CriterionProgress fromDateTime(AdvancementProgress advancementProgressIn, java.lang.String dateTime)`
- `java.util.Date getObtained()`
- `boolean isObtained()`
- `void obtain()`
- `static CriterionProgress read(PacketBuffer buf, AdvancementProgress advancementProgressIn)`
- `void reset()`
- `JsonElement serialize()`
- `java.lang.String toString()`
- `void write(PacketBuffer buf)`