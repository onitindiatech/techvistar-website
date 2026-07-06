import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  submitContactForm, 
  listContacts, 
  updateContactStatus, 
  deleteContact 
} from '@/controllers/contact.controller';
import { CONTACT_RATE_LIMIT } from '@/constants';

const router = Router();

const contactRateLimiter = rateLimit({
  windowMs:        CONTACT_RATE_LIMIT.WINDOW_MS,
  max:             CONTACT_RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success:    false,
    statusCode: 429,
    code:       'TOO_MANY_REQUESTS',
    message:    'Too many submissions from this IP. Please try again after 15 minutes.',
  },
});

// POST /api/contact - Public submission route
router.post('/', contactRateLimiter, submitContactForm);

// Admin endpoints (JWT gated in Phase 3, but available to frontend now)
router.get('/', listContacts);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router;

