import { getReadingHistory } from "@/actions/getReadingHistory";
import { getUserArticles } from "@/actions/getUserArticles";
import { getUserFavorites } from "@/actions/getUserFavorites";
import SavedArticlesList from "@/components/article/SavedArticlesList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LibraryPage = async () => {
  const [articles, favorites, history] = await Promise.all([
    getUserArticles(),
    getUserFavorites(),
    getReadingHistory(),
  ]);
  return (
    <div className="container max-w-7xl flex justify-between gap-10">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl font-semibold my-10">
            Your library
          </h1>
          <Button
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
      <div className="hidden sm:flex flex-col h-screen flex-1 border-l p-5">
        Second part
      </div>
    </div>
  );
};

export default LibraryPage;
