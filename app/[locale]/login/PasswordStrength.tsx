import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/use-translation';

interface PasswordRequirementProps {
  isValid: boolean;
  text: string;
}

function PasswordRequirement({ isValid, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
        {isValid ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" />
        )}
      </motion.div>
      <span className={cn('text-sm transition-colors', isValid ? 'text-green-500' : 'text-muted-foreground')}>
        {text}
      </span>
    </div>
  );
}

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export default function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { t } = useTranslation() as { t: typeof import('@/lib/translations/en').en };

  // Define validation criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return (
    <div className={cn('p-3 bg-muted/50 rounded-md space-y-2', className)}>
      <PasswordRequirement isValid={hasMinLength} text={t.login.passwordStrength.minLength} />
      <PasswordRequirement isValid={hasUppercase} text={t.login.passwordStrength.uppercase} />
      <PasswordRequirement isValid={hasLowercase} text={t.login.passwordStrength.lowercase} />
      <PasswordRequirement isValid={hasSymbol} text={t.login.passwordStrength.symbol} />
    </div>
  );
}
