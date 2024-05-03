import { useNavigate, useParams } from "react-router-dom";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { ProfileValidation } from "@/lib/validation";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
    }
  });

  const { data: currentUser } = useGetUserById(id || '');
  const { mutateAsync: updateUser, isPending: isPendingUpdate } = useUpdateUser();

  if (!currentUser) return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );

  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (!updatedUser) {
      toast({ title: 'Sorry, update failed! Please, try again.' });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl
    });

    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start justify-start gap-3 w-full max-w-5xl">
          <img src="/assets/icons/edit.svg" alt="edit" width={36} height={36} className="invert-white" />
          <h2>Edit Your Profile</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col gap-7 w-full max-w-5xl mt-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader fieldChange={field.onChange} mediaUrl={currentUser.imageUrl} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} className="shad-input" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center gap-4">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="shad-button_dark_4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => navigate(-1)}
                disabled={isPendingUpdate}
                className="shad-button_dark_4"
              >
                {isPendingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;