import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH = 'skipAuth';
export const Skipauth = () => SetMetadata(SKIP_AUTH, true);
