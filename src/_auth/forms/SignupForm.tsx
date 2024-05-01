import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { SignupValidation } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    }
  });

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: 'Sign up failed. Please try again.' });
        return;
      }

      const session = await signInAccount({ email: user.email, password: user.password });
      if (!session) {
        toast({ title: 'Sign in failed. Please try again.' });
        navigate('/sign-in');
        return;
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate('/');
      } else {
        toast({ title: 'Sign in failed. Please try again.' });
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="flex-col flex-center sm:w-[420px]">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram, please enter your details</p>

        <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="shad-input" />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="shad-input" />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : 'Sign Up'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-2">Sign In</Link>
          </p>
        </form>

      </div>
    </Form>
  );
};

export default SignupForm;