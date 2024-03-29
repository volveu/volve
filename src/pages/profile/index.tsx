import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { PageLayout } from "~/components/Layout";
import { signIn, useSession } from "next-auth/react";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { BlockedBadge } from "~/assets/BlockedBadge";

const ProfilePage: NextPage = () => {
  // session is `null` until nextauth fetches user's session data
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn();
    },
  });

  const { data: usrData, isLoading } = api.user.getUserByID.useQuery(
    { id: session?.user?.id ?? "" },
    { enabled: session?.user?.id != undefined && session?.user?.id != "" },
  );

  if (!session?.user?.id || isLoading) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <PageLayout>
          <LoadingPage />
        </PageLayout>
      </>
    );
  }

  if (!usrData) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <PageLayout>
          <div className="p-4">
            Sorry we are experiencing some issues loading the user, please try
            again later
          </div>
        </PageLayout>
      </>
    );
  }

  const {
    name,
    email,
    role,
    aboutMe,
    phoneNum,
    image: imageURL,
    id: userId,
  } = usrData;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="overscroll-y-scroll relative flex w-full flex-col items-start p-4 md:max-w-2xl">
          <img
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            src={imageURL || "/assets/profile-icon.jpg"}
            alt={`${name ?? ""}'s profile pic`}
            className="h-24 w-24 rounded-md rounded-t-lg border border-slate-400 bg-black bg-slate-200 object-contain hover:scale-105 sm:h-36 sm:w-36"
          />
          <div className="absolute right-0 top-0 m-2 p-4">
            <Link
              href="/profile/edit"
              className="rounded-md text-neutral-400 underline"
            >
              edit profile
            </Link>
          </div>
          <div className="py-1" />
          <div className="text-2xl font-bold">{name}</div>
          <div className="">{email}</div>
          {session.user.role == "ADMIN" && (
            <div className="mt-1 inline-block rounded bg-gray-200 px-2 text-blue-600">
              administrator
            </div>
          )}
          <div className="py-2" />
          <AwardBadgesForHours userId={userId} />
          <div className="py-1" />
          <AwardBadgesForNPOsHelped userId={userId} />
        </div>
        <div className="py-1" />
        <hr className="h-px border-0 bg-gray-700" />
        <div className="px-2">
          <div className="py-3" />
          <div className="border-px rounded-2xl border-solid border-slate-400 bg-slate-800 p-4">
            <MyImpact userId={userId} />
          </div>
          <div className="py-2" />

          {/* <div className="p-4">
          <div className="text-xl">My Interests</div>
          <div className="text-sm"></div>
        </div> */}
          <div className="p-4">
            <div className="text-xl">About Me</div>
            {aboutMe && <div className="text-sm">{aboutMe}</div>}
          </div>
          <div className="py-6" />
        </div>
      </PageLayout>
    </>
  );
};

type AwardBadgeProps = { userId: string };
const AwardBadgesForHours = ({ userId }: AwardBadgeProps) => {
  const { data: hrs, isLoading } = api.user.getHoursVolunteered.useQuery({
    id: userId,
  });
  if (isLoading) return <LoadingSpinner />;
  if (hrs == undefined) return null;

  const tiersInHours = [5, 10, 20, 50, 100, 9999];
  const logos = [
    "/assets/merlion.png",
    "/assets/hawkerstore.png",
    "/assets/gardensbythebay.jpg",
    "/assets/marinabayskyline.jpg",
    "/assets/sentosa.jpg",
  ];
  const logoDesc = [
    { heading: "Merlion Spirit", subtitle: "Protect and cherish (5 hours)" },
    {
      heading: "Hawker Hero",
      subtitle: "Share the taste of giving (10 hours)",
    },
    {
      heading: "Gardens by the Bay Bloom",
      subtitle: "Make Singapore blossom (20 hours)",
    },
    {
      heading: "Marina Bay Skyline",
      subtitle: "Reach for new heights (50 hours)",
    },
    {
      heading: "Sentosa Sun",
      subtitle: "Light up lives with your service (100 hours)",
    },
  ];
  const nextTierIdx = tiersInHours.findIndex((n) => n > hrs);

  const handleClick = ({
    heading,
    subtitle,
    locked,
  }: {
    heading: string;
    subtitle: string;
    locked: boolean;
  }) => {
    if (locked) {
      toast.error("badge has yet to be unlocked", {
        icon: "🔒",
        id: heading,
        style: { background: "black", color: "grey" },
      });
      return;
    }
    toast.success(`${heading}:\n ${subtitle}`, {
      icon: "🎖️",
      id: heading,
      style: { background: "grey", color: "white" },
      duration: 5000,
    });
  };

  return (
    <div className="flex gap-2">
      {logos.map((imgUrl, i) => {
        const isNextTier = i == nextTierIdx;
        if (i <= nextTierIdx) {
          return (
            <img
              onClick={() =>
                handleClick({ locked: isNextTier, ...logoDesc[i]! })
              }
              key={i}
              className={`${isNextTier && "opacity-40"} ${i < nextTierIdx && "border-emerald-500"} h-12 w-12 cursor-pointer rounded-full border-2 bg-slate-200 p-1 hover:scale-105`}
              src={imgUrl}
              alt={`Badge_${i}`}
            />
          );
        } else {
          return <BlockedBadge key={`${i}`} />;
        }
      })}
    </div>
  );
};

type AwardBadgeNPOsProps = { userId: string };
const AwardBadgesForNPOsHelped = ({ userId }: AwardBadgeNPOsProps) => {
  const { data: numOfNPOsHelped, isLoading } =
    api.user.getUserNPOParticipationCount.useQuery({ id: userId });
  if (isLoading) return <LoadingSpinner />;
  if (numOfNPOsHelped == undefined) return null;

  const tiersInNPOs = [1, 3, 5, 10, 9999];
  const logos = [
    "/assets/cocktail.png",
    "/assets/trishaw.png",
    "/assets/laksa.png",
    "/assets/spices.png",
  ];
  const logoDesc = [
    {
      heading: "Singapore Sling",
      subtitle: "Mix and match your causes (1 NPO)",
    },
    {
      heading: "Trishaw Tour",
      subtitle: "Explore different communities (3 NPOs)",
    },
    {
      heading: "Katong Laksa",
      subtitle: "Combine tradition with service (5 NPOs)",
    },
    {
      heading: "Little India Spice",
      subtitle: "Add yourunique fabor to the community (10 NPOs)",
    },
  ];
  const nextTierIdx = tiersInNPOs.findIndex((n) => n > numOfNPOsHelped);
  const handleClick = ({
    heading,
    subtitle,
    locked,
  }: {
    heading: string;
    subtitle: string;
    locked: boolean;
  }) => {
    if (locked) {
      toast.error("badge has yet to be unlocked", {
        icon: "🔒",
        id: heading,
        style: { background: "black", color: "grey" },
      });
      return;
    }
    toast.success(`${heading}:\n ${subtitle}`, {
      icon: "🏅",
      id: heading,
      style: { background: "grey", color: "white" },
      duration: 5000,
    });
  };

  return (
    <div className="flex gap-2">
      {logos.map((imgUrl, i) => {
        const isNextTier = i == nextTierIdx;
        if (i <= nextTierIdx) {
          return (
            <img
              onClick={() =>
                handleClick({ locked: isNextTier, ...logoDesc[i]! })
              }
              key={i}
              className={`${isNextTier && "opacity-40"} ${i < nextTierIdx && "border-emerald-500"} h-12 w-12 cursor-pointer rounded-full border-2 bg-slate-200 p-1 hover:scale-105`}
              src={imgUrl}
              alt={`Badge_${i}`}
            />
          );
        } else {
          return <BlockedBadge key={`${i}`} />;
        }
      })}
    </div>
  );
};

const MyImpact = ({ userId }: { userId: string }) => {
  const { data: numOfNPOsParticipationCount, isLoading: numNPOsLoading } =
    api.user.getUserNPOParticipationCount.useQuery({ id: userId });
  const { data: hrs, isLoading: hrsLoading } =
    api.user.getHoursVolunteered.useQuery({
      id: userId,
    });
  // TODO: change hardcoding
  const numOfRSVPs = 6;
  const handleGenerateReport = () => {
    toast("feature coming very soon!", {
      id: "report",
      icon: "📊",
      style: { background: "black", color: "grey" },
    });
  };
  if (hrsLoading || numNPOsLoading) return <LoadingSpinner />;
  if (hrs == undefined || numOfNPOsParticipationCount == null) return null;

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="pb-3 text-xl">My Impact</div>
        <div
          onClick={handleGenerateReport}
          className="cursor-pointer rounded-md text-neutral-400 underline"
        >
          generate report
        </div>
      </div>
      <div className="text-sm">{hrs} Hours Volunteered</div>
      <div className="text-sm">{numOfRSVPs} RSVPs</div>
      <div className="text-sm">{numOfNPOsParticipationCount} NPOs Helped</div>
    </div>
  );
};
export default ProfilePage;
