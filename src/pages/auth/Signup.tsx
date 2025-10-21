import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/Button';

import sty from './Signup.module.scss';

export const Signup = () => {
  return (
    <section className={sty.container}>
      <div className="sm-wrapper">
        <h1>Let's create an account</h1>
        <p>Sign up with</p>
        <Button variant="tertiary">
          <FcGoogle className={sty.icon_google} />
          Sign up with Google
        </Button>

        <p>Or with email</p>
        <form action="">
          <input type="text" required placeholder="Name" />
          <input type="email" required placeholder="Email" />
          <input type="password" required placeholder="Password" />
        </form>

        <p>
          By signing up, you agree to our Terms of Service and Privacy Policy.
          This site is protected by reCAPTCHA and the Google Terms of Service
          and Privacy Policy apply.
        </p>
      </div>
    </section>
  );
};
