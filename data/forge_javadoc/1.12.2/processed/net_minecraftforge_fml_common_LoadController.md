# LoadController

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.LoadController

## Class signature

```java
public class LoadController extends java.lang.Object
```

## Constructors

- `LoadController(Loader loader)`

## Methods

- `ModContainer activeContainer()`
- `void buildModList(FMLLoadEvent event)`
- `<any> buildModObjectList()`
- `@Deprecated void checkErrors()`
- `@Deprecated void checkErrorsAfterAvailable()`
- `void distributeStateMessage(java.lang.Class<?> customEvent)`
- `void distributeStateMessage(LoaderState state, java.lang.Object... eventData)`
- `void errorOccurred(ModContainer modContainer, java.lang.Throwable exception)`
- `java.util.List<ModContainer> getActiveModList()`
- `<any> getModObjectList()`
- `LoaderState.ModState getModState(ModContainer selectedMod)`
- `boolean isInState(LoaderState state)`
- `void printModStates(java.lang.StringBuilder ret)`
- `void propogateStateMessage(FMLEvent stateEvent)`
- `void transition(LoaderState desiredState, boolean forceState)`