import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import AuthLayout from '../auth-layout';
import { SignUpForm, type SignUpFormProps } from './components/sign-up-form';

const defaultDescription = (
  <>
    Enter your email and password to create an account. <br />
    Already have an account?{' '}
    <Link
      href="/sign-in"
      className="hover:text-primary underline underline-offset-4"
    >
      Sign In
    </Link>
  </>
);

const defaultFooter = (
  <p className="text-muted-foreground px-8 text-center text-sm">
    By creating an account, you agree to our{' '}
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

export interface SignUpProps {
  brand?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  formComponent?: ComponentType<SignUpFormProps>;
  formProps?: SignUpFormProps;
}

export default function SignUp({
  brand,
  title = 'Create an account',
  description = defaultDescription,
  footer = defaultFooter,
  formComponent: FormComponent = SignUpForm,
  formProps,
}: SignUpProps = {}) {
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
