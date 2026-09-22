# ASMEventHandler

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.ASMEventHandler

## Class signature

```java
public class ASMEventHandler extends java.lang.Object implements IEventListener
```

## Constructors

- `ASMEventHandler(java.lang.Object target, java.lang.reflect.Method method, ModContainer owner)`

## Methods

- `java.lang.Class<?> createWrapper(java.lang.reflect.Method callback)`
- `EventPriority getPriority()`
- `void invoke(Event event)`
- `java.lang.String toString()`