import { getAllArticles } from "@/actions/getAllArticles";
import { getTopPicks } from "@/actions/getTopPicks";
import { getUserFollowingList } from "@/actions/getUserFollowingList";
import { getWhoToFollow } from "@/actions/getWhoToFollow";
import ArticleCard from "@/components/article/ArticleCard";
import ArticlesList from "@/components/article/ArticlesList";
import FollowingList from "@/components/article/FollowingList";
import TopPicksCard from "@/components/article/TopPicksCard";
import WhoToFollow from "@/components/article/WhoToFollow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function FeedPage() {
  const [allArticles, topPicks, allFollowing, allWhoToFollow] =
    (await Promise.all([
      getAllArticles(1),
      getTopPicks(),
      getUserFollowingList(),
      getWhoToFollow(),
    ])) || null;
  return (
    <div className="container max-w-7xl flex flex-col md:flex-row p-10 gap-10">
      <div className="flex-1">
        <Tabs defaultValue="forYou">
          <TabsList className="bg-white sticky top-0 z-50 w-full py-8 border-b-[1px] rounded-none">
            <TabsTrigger value="forYou">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="forYou">
            <ArticleCard articles={allArticles} />
            <ArticlesList />
          </TabsContent>
          <TabsContent value="following">
            <FollowingList allFollowing={allFollowing} />
          </TabsContent>
        </Tabs>
      </div>
      <div className=" w-1/3 border-l-[1px] p-5 hidden md:block">
        <div className="md:sticky md:top-0 pt-14">
          <h3 className="text-sm font-semibold mb-3">Top picks</h3>
          <div>
            <TopPicksCard articles={topPicks} />
          </div>
          <h3 className="text-sm font-semibold mt-10 mb-3">Who to follow</h3>
          <div>
            <WhoToFollow articles={allWhoToFollow} />
          </div>
        </div>
      </div>
    </div>
  );
}
