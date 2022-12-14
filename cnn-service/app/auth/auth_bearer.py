from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.model import TokenResponse

import requests

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            tokenResponse = self.verify_jwt(credentials.credentials)
            if not tokenResponse['valid']:
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            request.state.user = tokenResponse['user']
            return tokenResponse
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> TokenResponse:
        try:
            print(jwtoken)
            return True
        except Exception as e:
            raise HTTPException(status_code=403, detail="Invalid token or expired token.")