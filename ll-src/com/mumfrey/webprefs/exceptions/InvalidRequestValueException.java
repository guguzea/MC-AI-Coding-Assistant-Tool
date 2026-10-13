package com.mumfrey.webprefs.exceptions;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public class InvalidRequestValueException extends InvalidRequestException
{
    private static final long serialVersionUID = 1L;
    
    public InvalidRequestValueException()
    {
        super(RequestFailureReason.BAD_PARAMS);
    }

    public InvalidRequestValueException(String message)
    {
        super(RequestFailureReason.BAD_PARAMS, message);
    }

    public InvalidRequestValueException(Throwable cause)
    {
        super(RequestFailureReason.BAD_PARAMS, cause);
    }

    public InvalidRequestValueException(String message, Throwable cause)
    {
        super(RequestFailureReason.BAD_PARAMS, message, cause);
    }
}
