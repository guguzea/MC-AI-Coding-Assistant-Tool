package com.mumfrey.webprefs.exceptions;

public class ReadOnlyPreferencesException extends InvalidPreferenceOperationException
{
    private static final long serialVersionUID = 1L;
    
    public ReadOnlyPreferencesException()
    {
    }

    public ReadOnlyPreferencesException(String message)
    {
        super(message);
    }

    public ReadOnlyPreferencesException(Throwable cause)
    {
        super(cause);
    }

    public ReadOnlyPreferencesException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
