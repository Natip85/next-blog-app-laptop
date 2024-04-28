import { getAllArticles } from "@/actions/getAllArticles";
import ArticlesList from "@/components/article/ArticlesList";

export default async function FeedPage() {
  const allArticles = await getAllArticles();
  return (
    <div className="container">
      <ArticlesList allArticles={allArticles} />
    </div>
  );
}
