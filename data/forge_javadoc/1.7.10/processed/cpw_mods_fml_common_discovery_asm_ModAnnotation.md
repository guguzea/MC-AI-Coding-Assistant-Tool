# ModAnnotation

## Class signature

```java
public class ModAnnotation extends java.lang.Object
```

## Constructors

- `public ModAnnotation(cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, java.lang.String member)`
- `public ModAnnotation(cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, ModAnnotation parent)`

## Methods

- `public java.lang.String toString()`
- `public cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType getType()`
- `public Type getASMType()`
- `public java.lang.String getMember()`
- `public java.util.Map<java.lang.String,java.lang.Object> getValues()`
- `public void addArray(java.lang.String name)`
- `public void addProperty(java.lang.String key, java.lang.Object value)`
- `public void addEnumProperty(java.lang.String key, java.lang.String enumName, java.lang.String value)`
- `public void endArray()`
- `public ModAnnotation addChildAnnotation(java.lang.String name, java.lang.String desc)`