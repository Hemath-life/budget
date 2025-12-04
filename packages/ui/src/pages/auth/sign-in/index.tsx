import type { ComponentType, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import AuthLayout from '../auth-layout';
import {
  UserAuthForm,
  type UserAuthFormProps,
} from './components/user-auth-form';

const defaultDescription = (
  <>
    Enter your email and password below to <br />
    log into your account
  </>
);

const defaultFooter = (
  <p className="text-muted-foreground px-8 text-center text-sm">
    By clicking login, you agree to our{' '}
    <a
      href="/terms"
      className="hover:text-primary underline underline-offset-4"
    >
      Terms of Service
    </a>{' '}
    and{' '}
    <a
      href="/privacy"
      className="hover:text-primary underline underline-offset-4"
    >
      Privacy Policy
    </a>
    .
  </p>
);

export interface SignInProps {
  brand?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  formComponent?: ComponentType<UserAuthFormProps>;
  formProps?: UserAuthFormProps;
}

export default function SignIn({
  brand,
  title = 'Login',
  description = defaultDescription,
  footer = defaultFooter,
  formComponent: FormComponent = UserAuthForm,
  formProps,
}: SignInProps = {}) {
  return (
    <AuthLayout brand={brand}>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <FormComponent {...(formProps ?? {})} />
        </CardContent>
        {footer ? <CardFooter>{footer}</CardFooter> : null}
      </Card>
    </AuthLayout>
  );
}
