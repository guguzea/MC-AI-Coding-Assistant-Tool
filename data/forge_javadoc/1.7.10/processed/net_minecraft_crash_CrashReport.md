# CrashReport

**Inheritance:** java.lang.Object → net.minecraft.crash.CrashReport

## Class signature

```java
public class CrashReport extends java.lang.Object
```

## Constructors

- `CrashReport(java.lang.String p_i1348_1_, java.lang.Throwable p_i1348_2_)`

## Methods

- `CrashReportCategory getCategory()`
- `java.lang.String getCauseStackTraceOrString()`
- `java.lang.String getCompleteReport()`
- `java.lang.Throwable getCrashCause()`
- `java.lang.String getDescription()`
- `java.io.File getFile()`
- `void getSectionsInStringBuilder(java.lang.StringBuilder p_71506_1_)`
- `CrashReportCategory makeCategory(java.lang.String p_85058_1_)`
- `CrashReportCategory makeCategoryDepth(java.lang.String p_85057_1_, int p_85057_2_)`
- `static CrashReport makeCrashReport(java.lang.Throwable p_85055_0_, java.lang.String p_85055_1_)`
- `boolean saveToFile(java.io.File p_147149_1_)`