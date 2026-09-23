import {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
} from "../services/auth.service";

const Profile = () => {
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const data =
            await getProfile();

          setUser(data.user);
        } catch (error) {
          console.error(error);
        }
      };

    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-8 text-3xl font-bold">
          My Profile
        </h1>

        <div className="space-y-5">
          <ProfileRow
            label="Name"
            value={user.name}
          />

          <ProfileRow
            label="Email"
            value={user.email}
          />

          <ProfileRow
            label="Phone"
            value={
              user.phone ||
              "Not provided"
            }
          />

          <ProfileRow
            label="Role"
            value={user.role}
          />

          <ProfileRow
            label="Joined"
            value={new Date(
              user.createdAt
            ).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({
  label,
  value,
}) => (
  <div className="border-b pb-4">
    <p className="text-sm text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-semibold">
      {value}
    </p>
  </div>
);

export default Profile;