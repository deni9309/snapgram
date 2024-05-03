import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetUsers();

  if (isErrorUsers) {
    toast({ title: 'There has been an error! Come back soon.' });
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoadingUsers && !users ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {users?.documents.map(user => (
              <li key={user?.$id} className="flex-1 w-full min-w-[200px]">
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;