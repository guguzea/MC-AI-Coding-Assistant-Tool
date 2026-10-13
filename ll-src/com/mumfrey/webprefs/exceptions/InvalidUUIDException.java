package com.mumfrey.webprefs.exceptions;

public class InvalidUUIDException extends RuntimeException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidUUIDException()
    {
    }

    public InvalidUUIDException(String message)
    {
        super(message);
    }

    public InvalidUUIDException(Throwable cause)
    {
        super(cause);
    }

    public InvalidUUIDException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
