import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";


const Saved = () => {
  const { toast } = useToast();
  const { data: currentUser, isLoading: isUserLoading, isError: isErrorUser } = useGetCurrentUser();

  if (isErrorUser) {
    toast({ title: 'An error occured! Please, try refreshing the page.' });
    return;
  }

  const savedPosts = currentUser?.save.map((saved: Models.Document) => ({
    ...saved.post,
    creator: {
      imageUrl: currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'
    }
  }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          alt="save"
          width={36}
          height={36}
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved by You</h2>
      </div>
      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="flex justify-center gap-9 w-full max-w-5xl">
          {savedPosts.length === 0 ? (
            <p className="text-light-3">You don't have any saved posts yet.</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} showUser={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;