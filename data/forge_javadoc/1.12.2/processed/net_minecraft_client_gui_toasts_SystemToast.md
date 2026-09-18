# SystemToast

## Class signature

```java
public class SystemToast extends java.lang.Object implements IToast
```

## Constructors

- `public SystemToast( SystemToast.Type typeIn, ITextComponent titleComponent, ITextComponent subtitleComponent)`

## Methods

- `public IToast.Visibility draw( GuiToast toastGui, long delta)`
- `public void setDisplayedText( ITextComponent titleComponent, ITextComponent subtitleComponent)`
- `public SystemToast.Type getType()`
- `public static void addOrUpdate( GuiToast p_193657_0_, SystemToast.Type p_193657_1_, ITextComponent p_193657_2_, ITextComponent p_193657_3_)`