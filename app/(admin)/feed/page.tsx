import { getAllArticles } from "@/actions/getAllArticles";
import ArticleCard from "@/components/article/ArticleCard";
import ArticlesList from "@/components/article/ArticlesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function FeedPage() {
  const allArticles = await getAllArticles(1);
  console.log("Page articles>>>", allArticles);

  return (
    <div className="container max-w-5xl flex flex-col sm:flex-row p-10 gap-10">
      <div className="flex-1">
        <Tabs defaultValue="forYou">
          <TabsList className="bg-white sticky top-0 z-50 w-full">
            <TabsTrigger value="forYou">For you</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="forYou">
            <ArticleCard articles={allArticles} />
            <ArticlesList />
          </TabsContent>
          <TabsContent value="published">published here</TabsContent>
        </Tabs>
      </div>
      <div className="w-1/3 border-l-[1px]">second part</div>
    </div>
  );
}
