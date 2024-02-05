import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import { signIn, useSession } from "next-auth/react";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import Link from "next/link";
import { UserRole } from "types";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  // session is `null` until nextauth fetches user's session data
  const { data: session, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn();
    },
  });

  if (!session) {
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

  const userData = session.user as {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    aboutMe: string | null;
    phoneNum: string | null;
    image: string | null;
  };

  const { name, email, role, aboutMe, phoneNum, image: imageURL } = userData;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="overscroll-y-scroll relative h-48 w-full border-x border-b bg-slate-600 md:max-w-2xl">
          <Image
            src={imageURL ?? "https://picsum.photos/300/300"}
            alt={`${name ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-md border-2 border-b bg-black"
          />
        </div>
        {/* spacer */}
        <div className="relative h-[64px]">
          <div className="absolute right-0 top-0 m-2 p-2">
            <Link
              href="/profile/edit"
              className="rounded-md text-neutral-400 underline"
            >
              edit profile
            </Link>
          </div>
        </div>
        <div className="p-4">
          <div className="text-2xl font-bold">{name}</div>
          <div className="">{email}</div>
          {session.user.role == "ADMIN" && (
            <div className="mt-1 inline-block rounded bg-gray-200 px-2 text-blue-600">
              administrator
            </div>
          )}
          <div className="py-2" />
          <AwardBadgesForHours userId={userData.id} />
          <div className="py-1" />
          <AwardBadgesForNPOsHelped userId={userData.id} />
        </div>
        <div></div>
        <div className="py-2" />
        <hr />
        <div className="p-4">
          <MyImpact userId={userData.id} />
        </div>
        <div className="p-4">
          <div className="text-xl">My Interests</div>
          <div className="text-sm"></div>
        </div>
        <div className="p-4">
          <div className="text-xl">About Me</div>
          {aboutMe && <div className="text-sm">{aboutMe}</div>}
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

  const BlockedBadge = (key?: string) => (
    <div key={key} className="h-12 w-12 rounded-full bg-slate-700"></div>
  );

  const tiersInHours = [5, 10, 20, 50, 100, 9999];
  const logos = [
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
  ];
  const nextTierIdx = tiersInHours.findIndex((n) => n > hrs);

  const handleClick = () => {
    toast("IMPLEMENT THIS");
  };

  return (
    <div className="flex gap-2">
      {logos.map((imgUrl, i) => {
        if (i <= nextTierIdx) {
          return (
            <Image
              onClick={handleClick}
              key={i}
              className={`${i == nextTierIdx && "opacity-40"} ${i < nextTierIdx && "border-green-700"} h-12 w-12 rounded-full border-2`}
              src={imgUrl}
              alt={`Badge_${i}`}
              height={20}
              width={20}
            />
          );
        } else {
          return BlockedBadge(`${i}`);
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

  const BlockedBadge = (key?: string) => (
    <div key={key} className="h-12 w-12 rounded-full bg-slate-700"></div>
  );

  const tiersInNPOs = [1, 3, 5, 10, 9999];
  const logos = [
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
    "https://picsum.photos/300/300",
  ];
  const nextTierIdx = tiersInNPOs.findIndex((n) => n > numOfNPOsHelped);
  const handleClick = () => {
    toast("IMPLEMENT THIS");
  };

  return (
    <div className="flex gap-2">
      {logos.map((imgUrl, i) => {
        if (i <= nextTierIdx) {
          return (
            <Image
              onClick={handleClick}
              key={i}
              className={`${i == nextTierIdx && "opacity-40"} ${i < nextTierIdx && "border-green-700"} h-12 w-12 rounded-full border-2`}
              src={imgUrl}
              alt={`Badge_${i}`}
              height={20}
              width={20}
            />
          );
        } else {
          return BlockedBadge(`${i}`);
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
  if (hrsLoading || numNPOsLoading) return <LoadingSpinner />;
  if (hrs == undefined || numOfNPOsParticipationCount) return null;

  return (
    <div>
      <div className="pb-3 text-xl">My Impact</div>
      <div className="text-sm">{hrs} Hours Volunteered</div>
      <div className="text-sm">{numOfRSVPs} RSVPs</div>
      <div className="text-sm">{numOfNPOsParticipationCount} NPOs Helped</div>
    </div>
  );
};
export default ProfilePage;
