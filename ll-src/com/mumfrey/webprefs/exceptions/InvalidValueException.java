package com.mumfrey.webprefs.exceptions;

public class InvalidValueException extends RuntimeException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidValueException()
    {
    }

    public InvalidValueException(String message)
    {
        super(message);
    }

    public InvalidValueException(Throwable cause)
    {
        super(cause);
    }

    public InvalidValueException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
