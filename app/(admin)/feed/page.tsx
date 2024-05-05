import { getAllArticles } from "@/actions/getAllArticles";
import ArticleCard from "@/components/article/ArticleCard";
import ArticlesList from "@/components/article/ArticlesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function FeedPage() {
  const allArticles = await getAllArticles(1);
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(allArticles);
  return (
    <div className="container max-w-5xl flex flex-col md:flex-row p-10 gap-10">
      <div className="flex-1">
        <Tabs defaultValue="forYou">
          <TabsList className="bg-white sticky top-0 z-50 w-full py-8 border-b-[1px] rounded-none">
            <TabsTrigger value="forYou">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="forYou">
            <ArticleCard articles={shuffledProducts} />
            <ArticlesList />
          </TabsContent>
          <TabsContent value="following">following goes here</TabsContent>
        </Tabs>
      </div>
      <div className="w-1/4 border-l-[1px] p-5">second part</div>
    </div>
  );
}
