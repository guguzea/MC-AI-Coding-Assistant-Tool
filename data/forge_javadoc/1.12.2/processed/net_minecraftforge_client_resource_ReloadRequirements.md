# ReloadRequirements

**Inheritance:** java.lang.Object → net.minecraftforge.client.resource.ReloadRequirements

## Class signature

```java
public final class ReloadRequirements extends java.lang.Object
```

## Constructors

- `ReloadRequirements()`

## Methods

- `static java.util.function.Predicate<IResourceType> all()` — Creates a reload predicate accepting all resource types.
- `static java.util.function.Predicate<IResourceType> include(IResourceType ... inclusion)` — Creates an inclusive reload predicate.