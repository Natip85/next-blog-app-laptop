import { getArticleById } from "@/actions/getArticleById";
import ArticleForm from "@/components/article/ArticleForm";
interface ArticlePageProps {
  params: {
    articleId: string;
  };
}
const ArticlePage = async ({ params }: ArticlePageProps) => {
  const article = await getArticleById(params.articleId);

  return <ArticleForm article={article} />;
};

export default ArticlePage;
