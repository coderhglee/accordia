import { Inject } from '@nestjs/common';
import { OIDC_PROVIDER } from '../oidc.constants';
 
export const InjectOidcProvider = () => Inject(OIDC_PROVIDER); 