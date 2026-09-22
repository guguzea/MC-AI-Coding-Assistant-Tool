# CrashReport

**Inheritance:** java.lang.Object → net.minecraft.crash.CrashReport

## Class signature

```java
public class CrashReport extends java.lang.Object
```

## Constructors

- `CrashReport(java.lang.String descriptionIn, java.lang.Throwable causeThrowable)`

## Methods

- `CrashReportCategory getCategory()`
- `java.lang.String getCauseStackTraceOrString()` — Gets the stack trace of the Throwable that caused this crash report, or if that fails, the cause .toString().
- `java.lang.String getCompleteReport()` — Gets the complete report with headers, stack trace, and different sections as a string.
- `java.lang.Throwable getCrashCause()` — Returns the Throwable object that is the cause for the crash and Crash Report.
- `java.lang.String getDescription()` — Returns the description of the Crash Report.
- `java.io.File getFile()` — Gets the file this crash report is saved into.
- `void getSectionsInStringBuilder(java.lang.StringBuilder builder)` — Gets the various sections of the crash report into the given StringBuilder
- `CrashReportCategory makeCategory(java.lang.String name)` — Creates a CrashReportCategory
- `CrashReportCategory makeCategoryDepth(java.lang.String categoryName, int stacktraceLength)` — Creates a CrashReportCategory for the given stack trace depth
- `static CrashReport makeCrashReport(java.lang.Throwable causeIn, java.lang.String descriptionIn)` — Creates a crash report for the exception
- `boolean saveToFile(java.io.File toFile)` — Saves this CrashReport to the given file and returns a value indicating whether we were successful at doing so.