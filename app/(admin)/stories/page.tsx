import { getUserArticles } from "@/actions/getUserArticles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoriesList from "@/components/article/StoriesList";
import TopPicksCard from "@/components/article/TopPicksCard";
import { getTopPicks } from "@/actions/getTopPicks";

const StoriesPage = async () => {
  const [articles, topPicks] =
    (await Promise.all([getUserArticles(), getTopPicks()])) || null;
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
};

export default StoriesPage;
