# TracingPrintStream

## Class signature

```java
public class TracingPrintStream extends java.io.PrintStream
```

## Constructors

- `public TracingPrintStream(org.apache.logging.log4j.Logger logger, java.io.PrintStream original)`

## Methods

- `public void println(java.lang.Object o)`
- `public void println(java.lang.String s)`

## Description

PrintStream which redirects it's output to a given logger.