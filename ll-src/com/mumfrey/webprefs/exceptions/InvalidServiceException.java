package com.mumfrey.webprefs.exceptions;

public class InvalidServiceException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    public InvalidServiceException()
    {
    }
    
    public InvalidServiceException(String message)
    {
        super(message);
    }
    
    public InvalidServiceException(Throwable cause)
    {
        super(cause);
    }
    
    public InvalidServiceException(String message, Throwable cause)
    {
        super(message, cause);
    }
    
}
