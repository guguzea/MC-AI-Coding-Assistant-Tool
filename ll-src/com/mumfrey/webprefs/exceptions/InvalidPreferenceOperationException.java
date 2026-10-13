package com.mumfrey.webprefs.exceptions;

public class InvalidPreferenceOperationException extends RuntimeException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidPreferenceOperationException()
    {
    }

    public InvalidPreferenceOperationException(String message)
    {
        super(message);
    }

    public InvalidPreferenceOperationException(Throwable cause)
    {
        super(cause);
    }

    public InvalidPreferenceOperationException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
