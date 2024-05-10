import { getAllArticles } from "@/actions/getAllArticles";
import { getTopPicks } from "@/actions/getTopPicks";
import ArticleCard from "@/components/article/ArticleCard";
import ArticlesList from "@/components/article/ArticlesList";
import TopPicksCard from "@/components/article/TopPicksCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function FeedPage() {
  const [allArticles, topPicks] =
    (await Promise.all([getAllArticles(1), getTopPicks()])) || null;
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
          <TabsContent value="following">following goes here</TabsContent>
        </Tabs>
      </div>
      <div className=" w-1/3 border-l-[1px] p-5 hidden md:block">
        <div className="md:sticky md:top-0 pt-16">
          <h3 className="text-sm font-semibold mb-5">Top picks</h3>
          <div>
            <TopPicksCard articles={topPicks} />
          </div>
        </div>
      </div>
    </div>
  );
}
