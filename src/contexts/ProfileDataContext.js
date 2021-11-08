import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // we will use the pageProfile later
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [currentUser]);

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) => {
            return profile.id === clickedProfile.id
              ? // This is the profile I clicked on, update its followers
                // count and set its following id
                {
                  ...profile,
                  followers_count: profile.followers_count + 1,
                  following_id: data.id,
                }
              : profile.is_owner
              ? // This is the profile of the logged in user
                // updated its following count
                { ...profile, following_count: profile.following_count + 1 }
              : // this is neither the profile we clicked on the profile we own
                // so just return it unchanged
                profile;
          }),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
