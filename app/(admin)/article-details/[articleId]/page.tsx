import { getArticleById } from "@/actions/getArticleById";
import ArticleDetailsClient from "@/components/article/ArticleDetailsClient";
interface ArticleDetailsProps {
  params: {
    articleId: string;
  };
}
const ArticleDetails = async ({ params }: ArticleDetailsProps) => {
  const article = await getArticleById(params.articleId);

  return <ArticleDetailsClient article={article} />;
};

export default ArticleDetails;
