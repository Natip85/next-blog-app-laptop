import { getReadingHistory } from "@/actions/getReadingHistory";
import { getTopPicks } from "@/actions/getTopPicks";
import { getUserArticles } from "@/actions/getUserArticles";
import { getUserFavorites } from "@/actions/getUserFavorites";
import SavedArticlesList from "@/components/article/SavedArticlesList";
import TopPicksCard from "@/components/article/TopPicksCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LibraryPage = async () => {
  const [articles, favorites, history, topPicks] = await Promise.all([
    getUserArticles(),
    getUserFavorites(),
    getReadingHistory(),
    getTopPicks(),
  ]);
  return (
    <div className="container max-w-7xl flex justify-between gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl font-semibold my-10">
            Your library
          </h1>
          <Button
            size={"sm"}
            asChild
            className="bg-green-600 rounded-3xl hover:bg-green-700"
          >
            <Link href={"/article/new"}>Write a story</Link>
          </Button>
        </div>
        <SavedArticlesList
          articles={articles}
          favorites={favorites}
          history={history}
        />
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

export default LibraryPage;
