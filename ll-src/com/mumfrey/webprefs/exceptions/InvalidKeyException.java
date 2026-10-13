package com.mumfrey.webprefs.exceptions;

public class InvalidKeyException extends RuntimeException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidKeyException()
    {
    }

    public InvalidKeyException(String message)
    {
        super(message);
    }

    public InvalidKeyException(Throwable cause)
    {
        super(cause);
    }

    public InvalidKeyException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
