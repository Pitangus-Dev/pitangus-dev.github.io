import type { APIRoute } from 'astro'
import { feed } from '../../../feed'

export const GET: APIRoute = ({ site }) => feed('es', site!)
