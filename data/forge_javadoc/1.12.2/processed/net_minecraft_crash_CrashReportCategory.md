# CrashReportCategory

## Class signature

```java
public class CrashReportCategory extends java.lang.Object
```

## Constructors

- `public CrashReportCategory( CrashReport report, java.lang.String name)`

## Methods

- `public static java.lang.String getCoordinateInfo(double x, double y, double z)`
- `public static java.lang.String getCoordinateInfo( BlockPos pos)`
- `public static java.lang.String getCoordinateInfo(int x, int y, int z)`
- `public void addDetail(java.lang.String nameIn, ICrashReportDetail <java.lang.String> detail)`
- `public void addCrashSection(java.lang.String sectionName, java.lang.Object value)`
- `public void addCrashSectionThrowable(java.lang.String sectionName, java.lang.Throwable throwable)`
- `public int getPrunedStackTrace(int size)`
- `public boolean firstTwoElementsOfStackTraceMatch(java.lang.StackTraceElement s1, java.lang.StackTraceElement s2)`
- `public void trimStackTraceEntriesFromBottom(int amount)`
- `public void appendToStringBuilder(java.lang.StringBuilder builder)`
- `public java.lang.StackTraceElement[] getStackTrace()`
- `public static void addBlockInfo( CrashReportCategory category, BlockPos pos, Block blockIn, int blockData)`
- `public static void addBlockInfo( CrashReportCategory category, BlockPos pos, IBlockState state)`