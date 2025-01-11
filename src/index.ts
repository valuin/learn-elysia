import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { note } from './note';
import { user } from './user';

const app = new Elysia()
    .use(swagger())
    .use(note)
    .use(user)
    .listen(3000)