import { getArticles } from "@/actions/getArticles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import moment from "moment";
import StoriesList from "@/components/article/StoriesList";

const StoriesPage = async () => {
  const articles = await getArticles();
  console.log(articles?.draftArticles);

  return (
    <div className="container max-w-7xl flex justify-between gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl font-semibold my-10">
            Your articles
          </h1>
          <Button
            asChild
            className="bg-green-600 rounded-3xl hover:bg-green-700"
          >
            <Link href={"/article/new"}>Write an article</Link>
          </Button>
        </div>
        <StoriesList articles={articles} />
      </div>
      <div className="hidden sm:flex flex-col h-screen flex-1 border-l p-5">
        SEcond part
      </div>
    </div>
  );
};

export default StoriesPage;
