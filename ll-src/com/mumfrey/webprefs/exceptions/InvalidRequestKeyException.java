package com.mumfrey.webprefs.exceptions;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public class InvalidRequestKeyException extends InvalidRequestException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidRequestKeyException()
    {
        super(RequestFailureReason.BAD_PARAMS);
    }

    public InvalidRequestKeyException(String message)
    {
        super(RequestFailureReason.BAD_PARAMS, message);
    }

    public InvalidRequestKeyException(Throwable cause)
    {
        super(RequestFailureReason.BAD_PARAMS, cause);
    }

    public InvalidRequestKeyException(String message, Throwable cause)
    {
        super(RequestFailureReason.BAD_PARAMS, message, cause);
    }
}
