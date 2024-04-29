import { getArticleById } from "@/actions/getArticleById";
import { getArticleComments } from "@/actions/getArticleComments";
import ArticleDetailsClient from "@/components/article/ArticleDetailsClient";
interface ArticleDetailsProps {
  params: {
    articleId: string;
  };
}
const ArticleDetails = async ({ params }: ArticleDetailsProps) => {
  const article = await getArticleById(params.articleId);
  const comments = await getArticleComments(params.articleId);

  return <ArticleDetailsClient article={article} comments={comments} />;
};

export default ArticleDetails;
